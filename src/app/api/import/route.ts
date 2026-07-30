import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-utils";
import { createSupabaseServerClient, createServiceRoleClient } from "@/lib/supabase-server";

const EVENT_COLUMNS: Record<string, { stroke: string; distance: number }> = {
  "Libre 25m": { stroke: "freestyle", distance: 25 },
  "Libre 50m": { stroke: "freestyle", distance: 50 },
  "Libre 100m": { stroke: "freestyle", distance: 100 },
  "Libre 200m": { stroke: "freestyle", distance: 200 },
  "Libre 400m": { stroke: "freestyle", distance: 400 },
  "Libre 800m": { stroke: "freestyle", distance: 800 },
  "Libre 1500m": { stroke: "freestyle", distance: 1500 },
  "Espalda 25m": { stroke: "backstroke", distance: 25 },
  "Espalda 50m": { stroke: "backstroke", distance: 50 },
  "Espalda 100m": { stroke: "backstroke", distance: 100 },
  "Espalda 200m": { stroke: "backstroke", distance: 200 },
  "Pecho 25m": { stroke: "breaststroke", distance: 25 },
  "Pecho 50m": { stroke: "breaststroke", distance: 50 },
  "Pecho 100m": { stroke: "breaststroke", distance: 100 },
  "Pecho 200m": { stroke: "breaststroke", distance: 200 },
  "Mariposa 25m": { stroke: "butterfly", distance: 25 },
  "Mariposa 50m": { stroke: "butterfly", distance: 50 },
  "Mariposa 100m": { stroke: "butterfly", distance: 100 },
  "Mariposa 200m": { stroke: "butterfly", distance: 200 },
  "Comb 100m": { stroke: "individual_medley", distance: 100 },
  "Comb 200m": { stroke: "individual_medley", distance: 200 },
  "Comb 400m": { stroke: "individual_medley", distance: 400 },
};

function parseExcelDate(value: unknown): string | null {
  if (!value) return null;
  const str = String(value).trim();
  if (!str) return null;

  if (typeof value === "number") {
    const epoch = new Date(1899, 11, 30);
    const date = new Date(epoch.getTime() + value * 86400000);
    return date.toISOString().split("T")[0];
  }

  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
  }

  const d = new Date(str);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
}

function parseTimeToMs(value: unknown): number | null {
  if (!value) return null;

  if (typeof value === "number") {
    if (value <= 0) return null;
    return Math.round(value * 86400000);
  }

  const str = String(value).trim();
  if (!str || str === "0") return null;

  const parts = str.split(/[:.]/);
  if (parts.length === 3) {
    const min = parseInt(parts[0]) || 0;
    const sec = parseInt(parts[1]) || 0;
    const ms = parseInt(parts[2]) || 0;
    const total = min * 60000 + sec * 1000 + ms;
    return total > 0 ? total : null;
  }
  if (parts.length === 2) {
    const sec = parseInt(parts[0]) || 0;
    const ms = parseInt(parts[1]) || 0;
    const total = sec * 1000 + ms;
    return total > 0 ? total : null;
  }

  return null;
}

function detectPoolType(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes("(LC)")) return "LCM";
  if (upper.includes("(SC)")) return "SCY";
  return "SCM";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return jsonError("Unauthorized", 401);

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("club_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (!roleData || !["club_admin", "coach"].includes(roleData.role)) {
      return jsonError("Only coaches and admins can import data", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return jsonError("No file provided");

    const swimmerId = formData.get("swimmer_id") as string | null;

    const XLSX = await import("xlsx");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

    const sheetName = workbook.SheetNames.find(n =>
      n.toLowerCase().includes("todos") || n.toLowerCase().includes("tiempos")
    ) || workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 });

    if (rows.length < 2) return jsonError("File is empty or has no data rows");

    const headerRow = rows[0];
    const dataRows = rows.slice(1);

    const eventColumns: { header: string; stroke: string; distance: number }[] = [];
    for (const [colName, eventInfo] of Object.entries(EVENT_COLUMNS)) {
      const idx = headerRow.findIndex(h => String(h).trim() === colName);
      if (idx !== -1) {
        eventColumns.push({ header: colName, ...eventInfo });
      }
    }

    if (eventColumns.length === 0) {
      return jsonError("No recognized event columns found. Expected columns like 'Libre 50m', 'Espalda 100m', etc.");
    }

    const fechaIdx = headerRow.findIndex(h => String(h).trim() === "Fecha");
    const tipoIdx = headerRow.findIndex(h => String(h).trim() === "Tipo");
    const nombreIdx = headerRow.findIndex(h => String(h).trim() === "Nombre");

    const serviceClient = createServiceRoleClient();

    const meetsByName = new Map<string, string>();
    let resultsCreated = 0;
    let meetsCreated = 0;
    let trialsCreated = 0;
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || (Array.isArray(row) && row.every(c => !c))) continue;

      const rowArray = Array.isArray(row) ? row : Object.values(row);
      const fecha = fechaIdx >= 0 ? parseExcelDate(rowArray[fechaIdx]) : null;
      const tipo = tipoIdx >= 0 ? String(rowArray[tipoIdx] || "").trim() : "";
      const nombre = nombreIdx >= 0 ? String(rowArray[nombreIdx] || "").trim() : "";

      if (!fecha) continue;

      const isCompetition = tipo.toLowerCase().includes("competencia");
      const poolType = isCompetition ? detectPoolType(nombre) : "SCM";

      let meetId: string | null = null;
      if (isCompetition && nombre) {
        const normalizedName = nombre.toUpperCase().trim();
        if (meetsByName.has(normalizedName)) {
          meetId = meetsByName.get(normalizedName)!;
        } else {
          const { data: existingMeet } = await serviceClient
            .from("meets")
            .select("id")
            .ilike("name", nombre)
            .limit(1)
            .single();

          if (existingMeet) {
            meetId = existingMeet.id;
          } else {
            const { data: newMeet } = await serviceClient
              .from("meets")
              .insert({
                name: nombre,
                club_id: roleData.club_id,
                meet_date: fecha,
                pool_type: poolType,
                level: "club",
                country_id: null,
              })
              .select("id")
              .single();

            if (newMeet) {
              meetId = newMeet.id;
              meetsCreated++;
            }
          }
          if (meetId) meetsByName.set(normalizedName, meetId);
        }
      }

      for (const col of eventColumns) {
        const colIdx = headerRow.findIndex(h => String(h).trim() === col.header);
        if (colIdx < 0) continue;

        const timeMs = parseTimeToMs(rowArray[colIdx]);
        if (!timeMs) continue;

        const { data: eventData } = await serviceClient
          .from("events")
          .select("id")
          .eq("distance", col.distance)
          .eq("stroke", col.stroke)
          .eq("pool_type", poolType)
          .limit(1)
          .single();

        if (!eventData) continue;

        if (isCompetition && meetId) {
          const { error: insertError } = await serviceClient
            .from("results")
            .insert({
              swimmer_id: swimmerId,
              meet_id: meetId,
              event_id: eventData.id,
              official_time_ms: timeMs,
            });

          if (insertError) {
            errors.push(`Row ${i + 2}: ${col.header} - ${insertError.message}`);
          } else {
            resultsCreated++;
          }
        } else {
          const { error: insertError } = await serviceClient
            .from("time_trials")
            .insert({
              swimmer_id: swimmerId,
              distance: col.distance,
              time_ms: timeMs,
              trial_date: fecha,
              pool_type: poolType,
              notes: nombre || undefined,
            });

          if (insertError) {
            errors.push(`Row ${i + 2}: ${col.header} - ${insertError.message}`);
          } else {
            trialsCreated++;
          }
        }
      }
    }

    return jsonSuccess({
      summary: {
        resultsCreated,
        meetsCreated,
        trialsCreated,
        errors: errors.length,
        errorDetails: errors.slice(0, 10),
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Import failed", 500);
  }
}

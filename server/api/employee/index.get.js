import { pool } from "../db";

export default defineEventHandler(async (e) => {
  // вытаскиваем всех работников и вкладываем им их расписание не раньше текущей даты
  const withWorkShifts = `SELECT
    e.id AS emp_id, e.name, e.surname, e.secondname, e.emp_phone,

    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'id', ws.id,
                'empId', ws.emp_id,
                'startDt', ws.start_dt,
                'endDt', ws.end_dt
            )
        ) FILTER (WHERE ws.id IS NOT NULL AND ws.start_dt >= CURRENT_DATE),
        '[]'::jsonb
    ) AS work_shift

    FROM employee e
    LEFT JOIN work_shift ws ON e.id = ws.emp_id
    GROUP BY
    e.id, e.name; `;

  const withWorkShiftsAndAssignations = `
   SELECT
    e.id AS emp_id,
    e.name, e.surname, e.secondname, e.emp_phone, e.avail_services,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'work_shift_id', subquery.work_shift_id,
                'start_dt', subquery.start_dt,
                'end_dt', subquery.end_dt,
                'assignations', subquery.assignations
            )
        ) FILTER (WHERE subquery.work_shift_id IS NOT NULL AND subquery.start_dt >= CURRENT_DATE),
        '[]'::jsonb
    ) AS work_shift
    FROM
        employee e
    LEFT JOIN (
        SELECT
            ws.id AS work_shift_id,
            ws.emp_id,
            ws.start_dt,
            ws.end_dt,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'assignation_id', a.id,
                        'work_shift_id', a.work_shift_id,
    					'assign_dt',a.assign_dt,
    					'phone', a.phone,
    					'services', a.services,
    					'client_name', a.client_name
                    )
                ) FILTER (WHERE a.id IS NOT NULL ),
                '[]'::jsonb
            ) AS assignations
        FROM
            work_shift ws
        LEFT JOIN
            assignation a ON ws.id = a.work_shift_id
        GROUP BY
            ws.id, ws.emp_id, ws.start_dt
    ) AS subquery ON e.id = subquery.emp_id
    GROUP BY
        e.id, e.name;
   `;

  const result = await pool.query(withWorkShiftsAndAssignations);
  console.log(result.rows[0]);
  return {
    data: result.rows,
  };
});

[
  {
    startDt: "2023-12-16T08:00:00",
    workShiftId: 2,
    assignations: [
      {
        workShiftId: null,
        assignationId: null,
      },
    ],
  },
  {
    startDt: "2023-12-17T08:00:00",
    workShiftId: 3,
    assignations: [
      {
        workShiftId: null,
        assignationId: null,
      },
    ],
  },
  {
    startDt: "2023-12-15T08:00:00",
    workShiftId: 1,
    assignations: [
      {
        workShiftId: 1,
        assignationId: 4,
      },
    ],
  },
];

// Mätvärden från SPS30 (partikelsensor)

import express from "express";
import { getAllMeasurements } from "../utils/measurementsService.js";

const router = express.Router();

/**
//  * @swagger
 * /sps30:
 *  get:
 *    summary: Mätningar från SPS30 partikelsensor.
 *    description: Route för att hämta alla mätningar från SPS30.
 *    tags:
 *      - app
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        description: Antal mätningar att returnera (t.ex. ?limit=10)
 *    responses:
 *      200:
 *        description: Alla mätningar hämtade.
 */
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const measurements = await getAllMeasurements(limit);
    // Plocka ut endast id, timestamp och partikelmätningar
    const filtered = measurements.map(
      ({
        id,
        timestamp,
        pm1,
        pm2_5,
        pm4,
        pm10,
        nc_0_5,
        nc_1_0,
        nc_2_5,
        nc_4_0,
        nc_10_0,
        typical_particle_size,
      }) => ({
        id,
        timestamp,
        pm1,
        pm2_5,
        pm4,
        pm10,
        nc_0_5,
        nc_1_0,
        nc_2_5,
        nc_4_0,
        nc_10_0,
        typical_particle_size,
      })
    );
    res.json(filtered);
  } catch (err) {
    console.error("Fel vid läsning av SPS30-mätningar:", err);
    res.status(500).json({
      error: "Kunde inte läsa partikelsensordata",
      details: err.message,
    });
  }
});

export default router;

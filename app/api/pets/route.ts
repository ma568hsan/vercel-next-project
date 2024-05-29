import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
/**
 * @swagger
 * /api/pets:
 *   post:
 *     description: Adds a new pet to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               petName:
 *                 type: string
 *                 description: Name of the pet
 *               ownerName:
 *                 type: string
 *                 description: Name of the owner
 *     responses:
 *       200:
 *         description: List of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       Name:
 *                         type: string
 *                       Owner:
 *                         type: string
 *       402:
 *         description: Pet and owner names required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(request: Request) {
  const body = await request.json();
  const { petName, ownerName } = body;

  try {
    if (!petName || !ownerName) {
      return NextResponse.json({ error: 'Pet and owner names required' }, { status: 402 });
    }

    await sql`INSERT INTO Pets (Name, Owner) VALUES (${petName}, ${ownerName});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const pets = await sql`SELECT * FROM Pets;`;
  return NextResponse.json({ pets: pets.rows }, { status: 200 });
}


// GET request to retrieve all pets
/**
 * @swagger
 * /api/pets:
 *   get:
 *     description: Retrieves a list of all pets from the database
 *     responses:
 *       200:
 *         description: A list of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       ID:
 *                         type: integer
 *                       Name:
 *                         type: string
 *                       Owner:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function GET() {
  try {
    const pets = await sql`SELECT * FROM Pets;`;
    return NextResponse.json({ pets: pets.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
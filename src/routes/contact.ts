import { Router, Request, Response } from 'express';
import { Contact } from '../models/Contact';

const router = Router();

/**
 * POST /api/contact
 * Saves a new contact form submission to MongoDB
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios: nombre, email y mensaje.',
      });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    return res.status(201).json({
      success: true,
      message: '¡Mensaje recibido! Nos pondremos en contacto pronto.',
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        createdAt: newContact.createdAt,
      },
    });
  } catch (error: unknown) {
    console.error('Contact route error:', error);

    // Mongoose validation error
    if (error instanceof Error && error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Datos no válidos. Por favor revisa los campos.',
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
    });
  }
});

/**
 * GET /api/contact
 * Lists all contact submissions (admin use)
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
});

export default router;

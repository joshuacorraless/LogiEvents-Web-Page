import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ninguna imagen" });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "eventos",
      public_id: `event_${Date.now()}`,
      resource_type: "auto"
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error("Error en uploadImage:", error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};
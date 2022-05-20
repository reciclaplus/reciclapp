// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    res.status(200).json(
        [
            { name: 'Barrio Blanco', value: 400 },
            { name: 'Barrio Pintado', value: 300 },
            { name: 'Barrio Nuevo', value: 300 },
            { name: 'Ojo de Agua', value: 200 },
            { name: 'San Francisco', value: 278 },
            { name: 'El Abanico', value: 189 },
            { name: 'Los Cartones', value: 200 },
            { name: 'Barrio Tranquilo', value: 278 },
            { name: 'Las Mercedes', value: 189 },
          ]
    )
  }
  
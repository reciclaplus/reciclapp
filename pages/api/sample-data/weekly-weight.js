// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler (req, res) {
  res.status(200).json(
    [
      {
        date: '25/5/2022',
        pet: 450,
        galones: 120,
        plasticoduro: 100,
        basura: 10
      },

      {
        date: '18/5/2022',
        pet: 420,
        galones: 100,
        plasticoduro: 60,
        basura: 20
      },

      {
        date: '11/5/2022',
        pet: 400,
        galones: 100,
        plasticoduro: 60,
        basura: 25
      },

      {
        date: '4/5/2022',
        pet: 370,
        galones: 120,
        plasticoduro: 40,
        basura: 15
      },

      {
        date: '25/5/2022',
        pet: 350,
        galones: 70,
        plasticoduro: 60,
        basura: 20
      },

      {
        date: '27/4/2022',
        pet: 300,
        galones: 60,
        plasticoduro: 35,
        basura: 20
      }
    ]
  )
}

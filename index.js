import 'dotenv/config.js'

app.listen(process.env.PORT, () =>
  console.log(`listening on ${process.env.PORT}`),
)

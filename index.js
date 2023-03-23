require("dotenv").config()
const app = require("./app")

app.listen(process.env.PORT ||4000, ()=> {
    console.log(`Server is running on PORT ${process.env.PORT ||4000}`)
})


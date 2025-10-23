import express from 'express'
import dotenv from 'dotenv';
import betRouter from './api/bet'

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/bet', betRouter)

app.get('/health', (req,res) => {
    res.send('OK')
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
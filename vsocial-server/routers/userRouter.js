const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.send('You got users')
})

module.exports = router
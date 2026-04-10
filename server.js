const express = require('express');
const cors = require('cors');
const passport = require('passport');
const db = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for image uploads)
app.use('/uploads', express.static('uploads'));

// Passport config
require('./config/passport')(passport);
app.use(passport.initialize());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/offers', require('./routes/offer.routes'));
app.use('/api/deals', require('./routes/deal.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/discovery', require('./routes/discovery.routes'));
app.use('/api/portfolio', require('./routes/portfolio.routes'));

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
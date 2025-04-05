import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config/config.js';
import passport from './config/passport.js';

import userRoutes from './routes/user.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB 
mongoose.connect(CONFIG.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Configuración de Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Rutas
app.use('/api/users', userRoutes);

// Ruta principal (vista renderizada)
app.get('/', (req, res) => {
  res.render('home', { title: 'Bienvenido a Lovecoffe ☕' });
});

// Iniciar servidor
app.listen(CONFIG.PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${CONFIG.PORT}`)
);

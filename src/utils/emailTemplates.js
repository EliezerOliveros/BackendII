import { EMAIL_TYPES } from '../constants/email.types.js';

export function getEmailTemplate(type, data = {}) {
  switch (type) {
    case EMAIL_TYPES.WELCOME:
      return {
        subject: '¡Bienvenido a Lovecoffe! ☕',
        html: `
          <h1>Hola, ${data.first_name} 👋</h1>
          <p>Gracias por registrarte en <strong>Lovecoffe</strong>.</p>
          <p>Ya podés comenzar a explorar y ordenar tus productos favoritos 🍪</p>
        `,
      };

    case EMAIL_TYPES.CREATED_ORDER:
      return {
        subject: `Confirmación de tu orden #${data.orderNumber} en Lovecoffe`,
        html: `
          <h2>¡Hola ${data.first_name}!</h2>
          <p>Tu orden <strong>#${data.orderNumber}</strong> fue creada con éxito en <strong>${data.businessName}</strong>.</p>
          <h3>Resumen de tu pedido:</h3>
          <ul>
            ${data.products.map(p => `<li>${p.name} - $${p.price}</li>`).join('')}
          </ul>
          <p><strong>Total:</strong> $${data.totalPrice}</p>
        `,
      };

    default:
      return { subject: 'Notificación de Lovecoffe', html: '<p>Sin contenido.</p>' };
  }
}

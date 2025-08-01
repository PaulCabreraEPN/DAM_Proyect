# 🌍 Aplicación de Ubicación en Tiempo Real con Supabase y Google Maps

Este proyecto muestra un mapa interactivo que visualiza en tiempo real la ubicación de usuarios, utilizando *Supabase* como backend y *Google Maps* como frontend. Los usuarios están asociados a territorios, y cada ubicación se representa mediante un marcador personalizado.

## 🌐 Enlace a la aplicación

🔗 [https://locations-sooty-nine.vercel.app](https://locations-sooty-nine.vercel.app)

---

## 🧑‍💻 Integrantes del equipo

- *Anthony Astudillo*
- *Paul Cabrera*
- *Mireya García*
- *Mateo Torres*

---

## 🚀 Tecnologías y librerías utilizadas

### Frontend
- [React](https://react.dev/)
- [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api) – Para la integración con Google Maps.
- [React Toastify](https://fkhadra.github.io/react-toastify/) – Para notificaciones.
- [TailwindCSS](https://tailwindcss.com/) – Para los estilos visuales.
- [React Router DOM](https://reactrouter.com/) – Para la navegación entre páginas.

### Backend
- [Supabase](https://supabase.com/) – Para base de datos, autenticación y suscripciones en tiempo real.

---

## ⚙️ Funcionamiento del programa

1. *Carga del mapa:*  
   Al ingresar a la aplicación, se carga Google Maps centrado en un punto inicial.

2. *Suscripción en tiempo real:*  
   Se establece una suscripción a la tabla locations de Supabase para recibir actualizaciones automáticas al agregar nuevas ubicaciones.

3. *Visualización dinámica:*  
   - Los marcadores muestran la latitud y longitud de cada usuario.
   - Los colores de los marcadores indican su estado (activo o inactivo).
   - Al hacer clic en un marcador, se despliega una ventana con los datos del usuario y su territorio.

4. *Filtro por territorio:*  
   Se puede filtrar la visualización por territorio para enfocarse en áreas específicas.

---

## 📸 Capturas de pantalla

> Agrega aquí tus imágenes una vez subidas al repositorio (por ejemplo, en una carpeta /screenshots).

```markdown
### Vista general del mapa
<img src="https://github.com/user-attachments/assets/59de1154-d4d4-4180-ae35-3fe8ba6f03c5" alt="Mapa en tiempo real" width="100%">

### InfoWindow con detalles del usuario
![InfoWindow activa](screenshots/info_usuario.png)

### Filtro de territorios
![Filtro aplicado](screenshots/filtro_territorio.png)
ese es el readme pero no me dejo pegar las capturas salen raras con todo ya te las paso solo eso falta

# 🌍 Aplicación de Ubicación en Tiempo Real con Supabase y Google Maps

Este proyecto muestra un mapa interactivo que visualiza en tiempo real la ubicación de usuarios, utilizando *Supabase* como backend y *Google Maps* como frontend. Los usuarios están asociados a territorios, y cada ubicación se representa mediante un marcador personalizado.

## 🌐 Enlace a la aplicación

🔗 [https://locations-sooty-nine.vercel.app](https://locations-sooty-nine.vercel.app)

---
## Evidencias 
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/898462da-34ca-4963-bb38-58c0198696ed" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/35e6de3c-a278-4446-ac78-4b786d9b2559" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/d9b5cdb2-64e8-4f22-b100-12c9eb604f3d" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/27629f95-1e0c-460e-9868-9d2013cdb9a8" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/27006050-407d-4871-a3fe-4db845b5e73d" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/8a6b1586-e3fd-4e36-b6f7-c54ca6c8a32f" />
<img width="400" height="200" alt="image" src="https://github.com/user-attachments/assets/a0f50223-a66e-4a5f-9b22-7f23ba5ba068" />

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

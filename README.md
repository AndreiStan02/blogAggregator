# 📦 Gator Aggregator

Este es un programa de línea de comandos (CLI) escrito en Node.js que permite ejecutar una serie de comandos registrados dinámicamente. Sirve como interfaz para operaciones relacionadas con usuarios, feeds, y acciones sociales (como seguir o dejar de seguir a otros usuarios).

## 🚀 Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tuusuario/tu-repo.git
   cd tu-repo
   ```

2. Asegúrate de tener Node.js instalado:

   ```bash
   node -v
   ```

3. Instala las dependencias si es necesario:

   ```bash
   npm install
   ```

## 🧠 Uso

```bash
npm run start <comando> [args...]
```

Si no se proporciona ningún comando, se mostrará un mensaje de uso y el programa se cerrará.

### 📋 Comandos disponibles

| Comando     | Descripción                                 |
| ----------- | ------------------------------------------- |
| `login`     | Iniciar sesión                              |
| `register`  | Registrar un nuevo usuario                  |
| `reset`     | Resetear información (según implementación) |
| `users`     | Listar usuarios                             |
| `agg`       | Realizar una operación de agregación        |
| `addfeed`   | Añadir un nuevo feed                        |
| `feeds`     | Mostrar feeds                               |
| `follow`    | Seguir a un feed                            |
| `following` | Listar a quién estás siguiendo              |
| `unfollow`  | Dejar de seguir a un feed.                  |
| `browse`    | Explorar contenido                          |


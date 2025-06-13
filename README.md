
## Inicio rapido

Se debe crear el .env en base al de ejemplo

```bash
npm run dev
```

## Docker alternativa

```
docker build --build-arg NEXT_PUBLIC_API_GOLANG=http://host.docker.internal:5000 -t mi-nextjs-app .
docker run -p 3000:3000 mi-nextjs-app
```

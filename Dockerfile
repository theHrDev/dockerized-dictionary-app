# Build stage
FROM node:20-alpine AS build      

WORKDIR /app                      

COPY package*.json ./            

RUN npm ci                   

COPY . .                         

RUN npm run build                

# Production stage
FROM httpd:2.4                    

COPY --from=build /app/dist /usr/local/apache2/htdocs/        

EXPOSE 80                             

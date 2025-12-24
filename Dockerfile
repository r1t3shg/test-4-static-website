FROM nginx:alpine

# Copy static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY log-emitter.js /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# nginx:alpine already has CMD to start nginx, so no need to override


# Damn Vulnerable NodeJS Application

FROM node:carbon
LABEL MAINTAINER "Subash SN"
USER nonroot
WORKDIR /app

COPY . .

RUN chmod +x /app/entrypoint.sh \
	&& npm install --ignore-scripts

CMD ["bash", "/app/entrypoint.sh"]
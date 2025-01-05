FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 80

CMD ["gunicorn", "--bind", "0.0.0.0:80", "--timeout", "3600", "--workers", "3", "backend.wsgi:application"]
import json
import os
import sys

try:
    from iracingdataapi.client import irDataClient
except ImportError:
    print("Por favor, asegúrate de tener instalada la librería: pip install iracingdataapi")
    sys.exit(1)

def main():
    creds_path = r"C:\Users\keker\Desktop\iracing_creds.txt"
    if not os.path.exists(creds_path):
        print("No se encontró el archivo iracing_creds.txt en el escritorio.")
        return

    with open(creds_path, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
        if len(lines) < 2:
            print("El archivo de credenciales no tiene correo y contraseña.")
            return
        username = lines[0]
        password = lines[1]

    print("Conectando a la API de iRacing...")
    try:
        idc = irDataClient(username=username, password=password)
    except Exception as e:
        print(f"Error autenticando: {e}")
        return

    out_dir = r"C:\Users\keker\.gemini\antigravity\scratch\iracing-smart-schedule\public"
    os.makedirs(out_dir, exist_ok=True)

    print("Descargando Pistas...")
    try:
        tracks = idc.get_tracks()
        with open(os.path.join(out_dir, "tracks.json"), "w", encoding="utf-8") as f:
            json.dump(tracks, f, ensure_ascii=False)
        print("  -> tracks.json guardado.")
    except Exception as e:
        print(f"  -> Error: {e}")

    print("Descargando Autos...")
    try:
        cars = idc.get_cars()
        with open(os.path.join(out_dir, "cars.json"), "w", encoding="utf-8") as f:
            json.dump(cars, f, ensure_ascii=False)
        print("  -> cars.json guardado.")
    except Exception as e:
        print(f"  -> Error: {e}")

    print("Descargando Temporadas (Schedules)...")
    try:
        seasons = idc.get_series_seasons()
        with open(os.path.join(out_dir, "seasons.json"), "w", encoding="utf-8") as f:
            json.dump(seasons, f, ensure_ascii=False)
        print("  -> seasons.json guardado.")
    except Exception as e:
        print(f"  -> Error: {e}")

    print("¡Base de datos replicada con éxito!")

if __name__ == "__main__":
    main()

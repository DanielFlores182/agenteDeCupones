'use client'; // <-- Necesario porque MapaAbstracto usa hooks de React (useState)

import MapaAbstracto from './components/MapaAbstracto'; // Asegúrese que la ruta sea correcta

export default function HomePage() {
  return (
    <div>
    
      <main>
        {/* Aquí se utiliza el componente */}
        <MapaAbstracto />
      </main>

     
    </div>
  );
}
const scriptURL = 'https://script.google.com/macros/s/AKfycby1-T2zr_rRG7BuWCKFjn25564H1VxRlGf0TKZYogU_sZlWFtsdD2crzm_XPshoed7t/exec';
//9
// Función para agregar gasto
function agregarGasto() {
    const nombre = document.getElementById('nombre').value;
    const gasto = parseFloat(document.getElementById('gasto').value);

    console.log(nombre, gasto); // Para verificar los valores

    if (nombre && !isNaN(gasto)) {
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Cambiado a 'cors'
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, gasto })
        })
        .then(response => {
            if (response.ok) {
                alert("Gasto agregado con éxito");
                cargarGastos(); // Actualizar la tabla
            } else {
                alert("Hubo un error al agregar el gasto");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error en la solicitud");
        });
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función para cargar los gastos desde Google Sheets
function cargarGastos() {
    fetch(scriptURL)
    .then(response => {
        if (!response.ok) throw new Error('Error en la carga de gastos');
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#tablaGastos tbody");
        tbody.innerHTML = '';

        let totalGastado = 0;
        data.forEach(gasto => {
            const row = document.createElement('tr');
            // Suponiendo que `gasto` es un arreglo, cambia aquí
            row.innerHTML = `<td>${gasto[0] || 'Sin nombre'}</td><td>$${parseFloat(gasto[1] || 0).toFixed(2)}</td>`;
            tbody.appendChild(row);
            totalGastado += parseFloat(gasto[1] || 0);
        });

        document.getElementById('totalGastado').innerText = `$${totalGastado.toFixed(2)}`;
    })
    .catch(error => {
        console.error('Error al cargar gastos:', error);
    });
}

// Función para calcular las diferencias
function calcularDiferencias() {
    const totalPorPersona = parseFloat(document.getElementById('totalGastado').innerText.slice(1)) / document.querySelectorAll("#tablaGastos tbody tr").length;
    document.getElementById('totalPorPersona').innerText = `$${totalPorPersona.toFixed(2)}`;
}

// Cargar los gastos cuando la página carga
window.onload = cargarGastos;



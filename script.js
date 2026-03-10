document.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("entrada");
    const visualizarBtn = document.getElementById("visualizar");
    const baixarBtn = document.getElementById("baixar");
    const container = document.getElementById("resultado");

    function processarTexto() {
        container.innerHTML = "";

        const texto = textarea.value;

        const linhas = texto
            .split("\n")
            .map(l => l.trim())
            .filter(l => l !== "");

        let etiquetas = [];

        // Extrai dados do texto
        for (let i = 0; i < linhas.length; i += 3) {

            const secretarias = (linhas[i] || "").split(/\s{2,}|\t/);
            const veiculos = (linhas[i + 1] || "").split(/\s{2,}|\t/);
            const placas = (linhas[i + 2] || "").split(/\s{2,}|\t/);

            const max = Math.max(secretarias.length, veiculos.length, placas.length);

            for (let j = 0; j < max; j++) {
                etiquetas.push({
                    sec: secretarias[j] || "",
                    veic: veiculos[j] || "",
                    placa: placas[j] || ""
                });
            }
        }

        // cria linhas da tabela
        let linhasTabela = [];

        for (let i = 0; i < etiquetas.length; i += 4) {

            const tr = document.createElement("tr");

            for (let j = 0; j < 4; j++) {

                const td = document.createElement("td");

                if (etiquetas[i + j]) {

                    const e = etiquetas[i + j];

                    td.innerHTML = `
                        <strong>${e.sec}</strong>
                        <div>${e.veic}</div>
                        <strong>${e.placa}</strong>
                    `;

                }

                tr.appendChild(td);
            }

            linhasTabela.push(tr);
        }

        // quantidade de linhas por página
        const LINHAS_POR_PAGINA = 12;

        for (let i = 0; i < linhasTabela.length; i += LINHAS_POR_PAGINA) {

            const pagina = document.createElement("div");
            pagina.className = "pagina";

            const tabela = document.createElement("table");
            const tbody = document.createElement("tbody");

            const bloco = linhasTabela.slice(i, i + LINHAS_POR_PAGINA);

            bloco.forEach(tr => tbody.appendChild(tr));

            tabela.appendChild(tbody);
            pagina.appendChild(tabela);

            container.appendChild(pagina);

        }
    }

    visualizarBtn.addEventListener("click", processarTexto);

    baixarBtn.addEventListener("click", () => {

        processarTexto();

        const elemento = document.getElementById("resultado");

        const opt = {
            margin: 0,
            filename: "etiquetas.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            }
        };

        html2pdf().set(opt).from(elemento).save();
    });
});

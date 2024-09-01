"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector("#search-form > form");
const inputCEP = document.querySelector("#input-cep");
const enderecoInfo = document.querySelector("#endereco-info");
const sectionCepInfo = document.querySelector("#cep-info");
const sectionTempoInfo = document.querySelector("#tempo-info");
const API_KEY = '9715aff4a4255fe1e35be13949db9bbe'; // Substitua pela sua chave de API
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (!inputCEP || !enderecoInfo || !sectionCepInfo || !sectionTempoInfo)
        return;
    const cep = inputCEP.value.trim();
    if (cep) {
        try {
            // Consultar API ViaCEP
            const respostaCEP = yield fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dadosCEP = yield respostaCEP.json();
            console.log('Dados CEP:', dadosCEP); // Verifique a resposta da API ViaCEP
            if (dadosCEP.erro) {
                alert('CEP inválido!');
                enderecoInfo.innerHTML = ''; // Limpar informações anteriores
                sectionCepInfo.style.display = 'none'; // Ocultar a section
                return;
            }
            const cidade = dadosCEP.localidade;
            const estado = dadosCEP.uf;
            const rua = dadosCEP.logradouro;
            // Consultar API OpenWeatherMap
            const respostaTempo = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade},${estado},BR&appid=${API_KEY}&lang=pt_br&units=metric`);
            const dadosTempo = yield respostaTempo.json();
            console.log('Dados Tempo:', dadosTempo); // Verifique a resposta da API OpenWeatherMap
            if (dadosTempo.cod !== 200) {
                alert(`Não foi possível obter as informações do clima. Código de erro: ${dadosTempo.cod}`);
                sectionTempoInfo.innerHTML = ''; // Limpar informações anteriores
                sectionCepInfo.style.display = 'block'; // Mostrar a section
                return;
            }
            const temperatura = Math.round(dadosTempo.main.temp);
            const icone = `https://openweathermap.org/img/wn/${dadosTempo.weather[0].icon}@2x.png`;
            const descricao = dadosTempo.weather[0].description;
            // Exibir informações do endereço e do clima
            enderecoInfo.innerHTML = `
                <h3>Endereço:</h3>
                <p>Rua: ${rua}</p>
                <p>Cidade: ${cidade}</p>
                <p>Estado: ${estado}</p>
                <h3>Clima:</h3>
                <p>Temperatura: ${temperatura}°C</p>
                <p>Descrição: ${descricao}</p>
                <img src="${icone}" alt="Ícone do clima" />
            `;
            // Mostrar a section com as informações
            sectionCepInfo.style.display = 'block';
            sectionTempoInfo.style.display = 'block'; // Garantir que a section de tempo esteja visível
        }
        catch (error) {
            console.error('Erro ao consultar o CEP ou o clima:', error);
            alert('Erro ao consultar o CEP ou o clima!');
            sectionCepInfo.style.display = 'none'; // Ocultar a section
        }
    }
    else {
        alert('Informe um CEP!');
        sectionCepInfo.style.display = 'none'; // Ocultar a section
    }
}));

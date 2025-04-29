// Modal handling
const modal = document.getElementById('toolModal');
const toolContent = document.getElementById('toolContent');
const closeBtn = document.querySelector('.close-btn');

function openTool(toolName) {
    modal.style.display = 'block';
    loadTool(toolName);
}

closeBtn.onclick = function() {
    modal.style.display = 'none';
    toolContent.innerHTML = '';
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        toolContent.innerHTML = '';
    }
}

// Tool loading function
function loadTool(toolName) {
    switch(toolName) {
        case 'calculator':
            loadCalculator();
            break;
        case 'unitConverter':
            loadUnitConverter();
            break;
        case 'textTools':
            loadTextTools();
            break;
        case 'colorPicker':
            loadColorPicker();
            break;
    }
}

// Calculator
function loadCalculator() {
    const calculatorHTML = `
        <h2>Calculator</h2>
        <div class="calculator">
            <div class="calculator-display">0</div>
            <div class="calculator-grid">
                <button class="calculator-button" onclick="appendNumber('7')">7</button>
                <button class="calculator-button" onclick="appendNumber('8')">8</button>
                <button class="calculator-button" onclick="appendNumber('9')">9</button>
                <button class="calculator-button" onclick="setOperation('/')">/</button>
                <button class="calculator-button" onclick="appendNumber('4')">4</button>
                <button class="calculator-button" onclick="appendNumber('5')">5</button>
                <button class="calculator-button" onclick="appendNumber('6')">6</button>
                <button class="calculator-button" onclick="setOperation('*')">×</button>
                <button class="calculator-button" onclick="appendNumber('1')">1</button>
                <button class="calculator-button" onclick="appendNumber('2')">2</button>
                <button class="calculator-button" onclick="appendNumber('3')">3</button>
                <button class="calculator-button" onclick="setOperation('-')">-</button>
                <button class="calculator-button" onclick="appendNumber('0')">0</button>
                <button class="calculator-button" onclick="appendNumber('.')">.</button>
                <button class="calculator-button" onclick="calculate()">=</button>
                <button class="calculator-button" onclick="setOperation('+')">+</button>
                <button class="calculator-button" onclick="clearCalculator()" style="grid-column: 1 / -1">Clear</button>
            </div>
        </div>
    `;
    toolContent.innerHTML = calculatorHTML;
}

let currentNumber = '';
let previousNumber = '';
let operation = null;

function appendNumber(number) {
    const display = document.querySelector('.calculator-display');
    if (number === '.' && currentNumber.includes('.')) return;
    currentNumber = currentNumber + number;
    display.textContent = currentNumber;
}

function setOperation(op) {
    if (currentNumber === '') return;
    if (previousNumber !== '') {
        calculate();
    }
    operation = op;
    previousNumber = currentNumber;
    currentNumber = '';
}

function calculate() {
    if (previousNumber === '' || currentNumber === '') return;
    let result;
    const prev = parseFloat(previousNumber);
    const current = parseFloat(currentNumber);
    switch(operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }
    currentNumber = result.toString();
    operation = null;
    previousNumber = '';
    document.querySelector('.calculator-display').textContent = currentNumber;
}

function clearCalculator() {
    currentNumber = '';
    previousNumber = '';
    operation = null;
    document.querySelector('.calculator-display').textContent = '0';
}

// Unit Converter
function loadUnitConverter() {
    const unitConverterHTML = `
        <h2>Unit Converter</h2>
        <div class="unit-converter">
            <select id="unitType">
                <option value="length">Length</option>
                <option value="weight">Weight</option>
                <option value="temperature">Temperature</option>
            </select>
            <input type="number" id="fromValue" placeholder="Enter value">
            <select id="fromUnit"></select>
            <select id="toUnit"></select>
            <div id="result">Result: </div>
        </div>
    `;
    toolContent.innerHTML = unitConverterHTML;
    
    const unitType = document.getElementById('unitType');
    unitType.addEventListener('change', updateUnitOptions);
    document.getElementById('fromValue').addEventListener('input', convertUnit);
    document.getElementById('fromUnit').addEventListener('change', convertUnit);
    document.getElementById('toUnit').addEventListener('change', convertUnit);
    
    updateUnitOptions();
}

const units = {
    length: ['meters', 'kilometers', 'miles', 'feet'],
    weight: ['kilograms', 'pounds', 'ounces', 'grams'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
};

function updateUnitOptions() {
    const unitType = document.getElementById('unitType').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';
    
    units[unitType].forEach(unit => {
        fromUnit.add(new Option(unit, unit));
        toUnit.add(new Option(unit, unit));
    });
    
    convertUnit();
}

function convertUnit() {
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const unitType = document.getElementById('unitType').value;
    
    if (isNaN(fromValue)) {
        document.getElementById('result').textContent = 'Result: ';
        return;
    }
    
    let result;
    
    // Convert to base unit first
    let baseValue;
    
    switch(unitType) {
        case 'length':
            baseValue = convertToMeters(fromValue, fromUnit);
            result = convertFromMeters(baseValue, toUnit);
            break;
        case 'weight':
            baseValue = convertToKilograms(fromValue, fromUnit);
            result = convertFromKilograms(baseValue, toUnit);
            break;
        case 'temperature':
            result = convertTemperature(fromValue, fromUnit, toUnit);
            break;
    }
    
    document.getElementById('result').textContent = `Result: ${result.toFixed(2)} ${toUnit}`;
}

function convertToMeters(value, unit) {
    switch(unit) {
        case 'meters': return value;
        case 'kilometers': return value * 1000;
        case 'miles': return value * 1609.34;
        case 'feet': return value * 0.3048;
        default: return value;
    }
}

function convertFromMeters(meters, unit) {
    switch(unit) {
        case 'meters': return meters;
        case 'kilometers': return meters / 1000;
        case 'miles': return meters / 1609.34;
        case 'feet': return meters / 0.3048;
        default: return meters;
    }
}

function convertToKilograms(value, unit) {
    switch(unit) {
        case 'kilograms': return value;
        case 'pounds': return value * 0.453592;
        case 'ounces': return value * 0.0283495;
        case 'grams': return value / 1000;
        default: return value;
    }
}

function convertFromKilograms(kg, unit) {
    switch(unit) {
        case 'kilograms': return kg;
        case 'pounds': return kg / 0.453592;
        case 'ounces': return kg / 0.0283495;
        case 'grams': return kg * 1000;
        default: return kg;
    }
}

function convertTemperature(value, fromUnit, toUnit) {
    let celsius;
    
    // Convert to Celsius first
    switch(fromUnit) {
        case 'Celsius':
            celsius = value;
            break;
        case 'Fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'Kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    switch(toUnit) {
        case 'Celsius':
            return celsius;
        case 'Fahrenheit':
            return (celsius * 9/5) + 32;
        case 'Kelvin':
            return celsius + 273.15;
    }
}

// Text Tools
function loadTextTools() {
    const textToolsHTML = `
        <h2>Text Tools</h2>
        <div class="text-tools">
            <textarea id="textInput" placeholder="Enter your text here..."></textarea>
            <div class="text-tools-buttons">
                <button onclick="transformText('uppercase')">UPPERCASE</button>
                <button onclick="transformText('lowercase')">lowercase</button>
                <button onclick="transformText('capitalize')">Capitalize</button>
                <button onclick="transformText('reverse')">Reverse</button>
            </div>
            <div class="text-info">
                <p>Characters: <span id="charCount">0</span></p>
                <p>Words: <span id="wordCount">0</span></p>
            </div>
        </div>
    `;
    toolContent.innerHTML = textToolsHTML;
    
    const textInput = document.getElementById('textInput');
    textInput.addEventListener('input', updateTextInfo);
}

function transformText(transformation) {
    const textInput = document.getElementById('textInput');
    let text = textInput.value;
    
    switch(transformation) {
        case 'uppercase':
            textInput.value = text.toUpperCase();
            break;
        case 'lowercase':
            textInput.value = text.toLowerCase();
            break;
        case 'capitalize':
            textInput.value = text.split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            break;
        case 'reverse':
            textInput.value = text.split('').reverse().join('');
            break;
    }
    updateTextInfo();
}

function updateTextInfo() {
    const text = document.getElementById('textInput').value;
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('wordCount').textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

// Color Picker
function loadColorPicker() {
    const colorPickerHTML = `
        <h2>Color Picker</h2>
        <div class="color-picker">
            <input type="color" id="colorInput" value="#2563eb">
            <div class="color-values">
                <p>HEX: <span id="hexValue">#2563eb</span></p>
                <p>RGB: <span id="rgbValue">rgb(37, 99, 235)</span></p>
                <p>HSL: <span id="hslValue">hsl(217, 91%, 53%)</span></p>
            </div>
        </div>
    `;
    toolContent.innerHTML = colorPickerHTML;
    
    const colorInput = document.getElementById('colorInput');
    colorInput.addEventListener('input', updateColorValues);
    updateColorValues();
}

function updateColorValues() {
    const color = document.getElementById('colorInput').value;
    document.getElementById('hexValue').textContent = color;
    
    // Convert hex to RGB
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    document.getElementById('rgbValue').textContent = `rgb(${r}, ${g}, ${b})`;
    
    // Convert RGB to HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    document.getElementById('hslValue').textContent = `hsl(${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
} 
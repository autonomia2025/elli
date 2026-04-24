import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

gallery_html = """      <div class="gallery-track">
        <div class="gallery-item">
          <img src="/dhamelys_cejas.png" alt="Depilación de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🔸</span>
            <h4>Depilación de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_bozo.png" alt="Depilación de Bozo">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🔸</span>
            <h4>Depilación de Bozo</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_henna.png" alt="Henna de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🌿</span>
            <h4>Henna de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_pestanas.png" alt="Pestañas por Punto">
          <div class="gallery-overlay">
            <span class="overlay-emoji">👁️</span>
            <h4>Pestañas por Punto</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_micro_cejas.png" alt="Micropigmentación de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✏️</span>
            <h4>Micropigmentación de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_microblading.png" alt="Microblading">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✨</span>
            <h4>Microblading</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_microshading.png" alt="Microshading">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✨</span>
            <h4>Microshading</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_labios.png" alt="Micropigmentación de Labios">
          <div class="gallery-overlay">
            <span class="overlay-emoji">💋</span>
            <h4>Micropigmentación de Labios</h4>
          </div>
        </div>
        <!-- Duplicate for infinite scroll -->
        <div class="gallery-item">
          <img src="/dhamelys_cejas.png" alt="Depilación de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🔸</span>
            <h4>Depilación de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_bozo.png" alt="Depilación de Bozo">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🔸</span>
            <h4>Depilación de Bozo</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_henna.png" alt="Henna de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">🌿</span>
            <h4>Henna de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_pestanas.png" alt="Pestañas por Punto">
          <div class="gallery-overlay">
            <span class="overlay-emoji">👁️</span>
            <h4>Pestañas por Punto</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_micro_cejas.png" alt="Micropigmentación de Cejas">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✏️</span>
            <h4>Micropigmentación de Cejas</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_microblading.png" alt="Microblading">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✨</span>
            <h4>Microblading</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_microshading.png" alt="Microshading">
          <div class="gallery-overlay">
            <span class="overlay-emoji">✨</span>
            <h4>Microshading</h4>
          </div>
        </div>
        <div class="gallery-item">
          <img src="/dhamelys_labios.png" alt="Micropigmentación de Labios">
          <div class="gallery-overlay">
            <span class="overlay-emoji">💋</span>
            <h4>Micropigmentación de Labios</h4>
          </div>
        </div>
      </div>"""

# Find the gallery-track div and replace it
pattern = re.compile(r'<div class="gallery-track">.*?</div>\s*</div>\s*<div class="specialist-cta', re.DOTALL)
new_content = pattern.sub(gallery_html + '\n    </div>\n\n    <div class="specialist-cta', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Gallery replaced successfully!")

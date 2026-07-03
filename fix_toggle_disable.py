js = open('foco-02.js', encoding='utf-8').read()

old_cond = "if (input.type === 'button' || input.type === 'submit' || input.type === 'hidden') return;"
new_cond = "if (input.type === 'button' || input.type === 'submit' || input.type === 'hidden' || input.id === btnId) return;"

js = js.replace(old_cond, new_cond)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Condicao ajustada para não desabilitar o próprio toggle.")

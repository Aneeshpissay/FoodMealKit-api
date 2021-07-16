
const columns = ["Ingredient Name", "Quantity", "Measurement"];

const headerRow = (data) => {
    const htmlContent = `<th>${data}</th>`;
    return htmlContent;
}

const header = (data) => {
    var text = "";
    for(var i=0; i<data.length; i++){
        text += headerRow(data[i]);
    }
    return text;
}

const rowData = (data) => {
    const htmlContent = `<td><p class="ingredientsName">${data}</p></td>`;
    return htmlContent;
}

const row = (data) => {
    var text = "";
    for(var i=0;i<data.length;i++){
        text += "<tr>";
        text += rowData(data[i].name);
        text += rowData(data[i].quantity);
        text += rowData(data[i].measurement);
        text += "</tr>"
    }
    return text;
};

const methodData = (data) => {
    const htmlContent = `<p class="stepMeasure">${data}</p>`;
    return htmlContent;
}

const methods = (data) => {
    var text = "";
    for(var i=0;i<data.length;i++){
        text += `<div class="step">`;
        text += methodData(`Step ${i + 1}: `);
        text += methodData(data[i].method);
        text += "</div>"
    }
    return text;
};

const getHtmlContent = async (recipe) => {
    let htmlContent = '';
    htmlContent = `<p class="recipeName">${recipe.title}</p>`;
    htmlContent = `<p class="recipeDescription">${recipe.description}</p>`;
    htmlContent = `<p class="cookTime">Ready in under ${recipe.cookTime}</p>`;
    htmlContent = `<p class="ingredients">Ingredients</p>`;
    htmlContent = `<p class="cookTime">Servings: ${recipe.servings}</p>`;
    htmlContent = `<table class="recipe"><thead><tr>`;
    htmlContent += await header(columns);
    htmlContent += `</tr></thead>`;
    htmlContent += "<tbody>";
    htmlContent += await row(recipe.ingredients);
    htmlContent += `</tbody></table>`;
    htmlContent += '<p class="ingredients">Preparation</p>';
    htmlContent += await methods(recipe.preparation);
    return htmlContent;
  };

  module.exports = {
    getHtmlContent: getHtmlContent,
  };
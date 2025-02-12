
document.addEventListener('DOMContentLoaded', function() {
    var precioSlider = document.getElementById('precio_range');
    var precioValues = document.getElementById('precio_values');
    var precioMinInput = document.getElementById('filtro_precio_min');
    var precioMaxInput = document.getElementById('filtro_precio_max');
  
    noUiSlider.create(precioSlider, {
      start: [min, max],
      connect: true,
      range: {
        'min': min,
        'max': max
      },
      pips: {
        mode: 'values',
        values: [min, max],
        format: {
          to: function(value) {
            return value.toFixed(2);
          }
        }
      }
    });
  
    precioSlider.noUiSlider.on('update', function(values) {
      precioValues.innerHTML = values[0] + ' - ' + values[1];
      precioMinInput.value = values[0];
      precioMaxInput.value = values[1];
    });
  });
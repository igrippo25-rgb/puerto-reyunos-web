/* Ajustes hechos fuera de 3DVista, por la API del reproductor.
   Los archivos del tour (script_general.js / script_mobile.js) llevan un sello de contenido:
   si se editan a mano, el reproductor muestra la marca "3DVista Academic". Por eso los cambios
   de disponibilidad se aplican acá, al cargar, sin tocar el archivo sellado.

   Lotes vendidos que no figuran como tales en el tour exportado: */
(function () {
  var LOTES_VENDIDOS = [
    { label: 'S2C-35',
      overlay: 'overlay_343DEC43_2220_CE01_41B3_EEAE1D1791A8',
      area: 'HotspotPanoramaOverlayArea_3422CC4D_2220_CE06_41A3_D6DE38B5DC24',
      ficha: ['Container_339F0E1A_2526_8A58_41B5_688020C082C7', 'Container_30FE6282_252A_FA2B_4180_FE86BA56B3A6',
              'Container_3F446F2B_257A_8A78_41C1_5B33799182B7_mobile', 'Container_3F41BA9B_2567_8A58_41BA_7611B785BEFC_mobile'] },
    { label: 'S2C-36',
      overlay: 'overlay_343C51F1_2220_5601_4176_E7E6B5AB138E',
      area: 'HotspotPanoramaOverlayArea_342111FA_2220_5603_418C_832E24911E16',
      ficha: ['Container_3399CC82_2526_8E28_41C1_41C065A99953', 'Container_30FE6282_252A_FA2B_4180_FE86BA56B3A6',
              'Container_3F514843_2567_9628_41C1_A77241D99B5A_mobile', 'Container_3F446F2B_257A_8A78_41C1_5B33799182B7_mobile'] }
  ];
  // El cartel "Lote vendido" (escritorio y móvil) y su efecto de entrada, los mismos que usan los vendidos del tour.
  var CARTEL_VENDIDO = ['Container_01FBB8EE_2525_97F8_418A_13B2C139C613', 'Container_01FA88EE_2525_97F8_41B1_1B6340A4F39B',
                        'Container_48FDD217_5EAB_1B44_41D0_18653BB873FF_mobile', 'Container_49F4F7BF_5EBB_3944_41C4_0A3068A3103C_mobile'];
  var EFECTO = 'effect_0C111EBB_253A_8A58_41C1_B5A6DA40F8C1';

  function porId(root, id) {
    if (root[id]) return root[id];
    try { return window.tour.player.getById(id); } catch (e) { return undefined; }
  }

  function aplicar(root) {
    LOTES_VENDIDOS.forEach(function (lote) {
      var overlay = porId(root, lote.overlay), area = porId(root, lote.area);
      if (!overlay || !area) return;
      var datos = overlay.get('data');
      datos.tags = ['Vendidos'];
      datos.label = lote.label + ' VENDIDO';
      // Corre después del click original: cierra la ficha del lote y abre el cartel de vendido.
      area.bind('click', function () {
        lote.ficha.forEach(function (id) { var c = porId(root, id); if (c) c.set('visible', false); });
        CARTEL_VENDIDO.forEach(function (id) {
          var c = porId(root, id);
          if (c) root.setComponentVisibility(c, true, 0, porId(root, EFECTO), 'showEffect', false);
        });
      }, root);
    });
    delete root.get('data').tags2Overlays; // que el índice por etiqueta se rearme con los nuevos tags
  }

  var intentos = 0;
  function esperarTour() {
    var t = window.tour, root;
    try { root = t && t.player && t.player.getById('rootPlayer'); } catch (e) { root = undefined; }
    if (root && porId(root, LOTES_VENDIDOS[0].overlay)) { aplicar(root); return; }
    if (++intentos < 400) setTimeout(esperarTour, 250);
  }
  document.addEventListener('DOMContentLoaded', esperarTour);
})();

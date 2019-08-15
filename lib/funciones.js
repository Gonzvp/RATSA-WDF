if (document.domain=='localhost') WEB_ROOT=window.location.protocol+"//localhost/seo/";
else WEB_ROOT=window.location.protocol+"//"+document.domain+'/';

function abreModal(title, body, urlBody, ancho){
	if (title!='') $("#modal-title").html(title);
	if (body!='') $("#modal-body").html(body);
	else if (urlBody!=''){
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
		$.ajax( {
			type:"POST", url:urlBody,
			data:"t="+tiempo,
			success: function (msg) {
				$('#modal-body').html(msg);
			}
		} )		
	}
	$("#myModal").modal();
	if (ancho!='' && ancho!=undefined) {
		$(".modal-dialog").css("max-width", "95%");
		$(".modal-dialog").css("width", ancho);
	}
}

function revisaPromo(codigo){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/codPromo.php",
		data:"t="+tiempo+"&codigo="+codigo,
		success: function (msg) { 
			var data = msg.split("#");
			if (data[0]=='error'){
				swal({
					title: "Código no válido",
					text: "El código de promoción indicado no es válido",
					type: "warning",
					timer: 3000
				});					
				$('#codPromo').val("");
			}else{
				marcaProducto(data[0], 'promo');
				swal({
					title: "Código valido",
					text: "",
					type: "success",
					timer: 3000
				});
				$("#formTPV").html("<br><input type='button' value='Continuar' onClick='javascript:completoPagar(\"texto\");'>");
				if (data[1]==1) $('#forma_pago').hide();
				else $('#forma_pago').show();
			}
		}
	} )		
}

function sweet(title, texto, type, timer){
	if (type=='') type='success';
	if (timer=='') timer='3000';
	swal({
		title: title,
		text: texto,
		type: type,
		timer: 3000
	});	
	
}

function login(nombreUsuario, clave, permanecer){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/login.php",
		data:"t="+tiempo+"&nombreUsuario="+nombreUsuario+"&clave="+clave+"&permanecer="+permanecer,
		success: function (msg) {
			$('#modal-body').html(msg);
		}
	} )		
}

function contacto(){
	email=$('#dirContacto').val();
	texto=$('#textoContacto').val();
	if (email==''){
		swal({ 
			title: "Contacto",
			text: "Es necesario indicar un email de contacto",
			type: "warning",
			timer: 5000
		});			
		return false;		
	}else if (!validaEmail(email)){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar un email correcto",
			type: "warning",
			timer: 3000
		});			
		return false;	
	}else if (texto==''){
		swal({ 
			title: "Contacto",
			text: "Es necesario indicar el texto",
			type: "warning",
			timer: 5000
		});			
		return false;		
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/contacto.php",
		data:"t="+tiempo+"&email="+email+"&texto="+texto,
		success: function (msg) {
			$("#modal-body").html("");
			if (msg=='ok'){
				swal({ 
					title: "Envio correcto",
					text: "El mensaje se ha enviado\nTe responderemos en breve",
					type: "success",
					timer: 5000
				});	
			}else{
				swal({ 
					title: "Error",
					text: "Ha habido un error\nInténtalo de nuevo más tarde",
					type: "warning",
					timer: 5000
				});					
			}
		}
	} )		
}

function registrarse1(email, password, password2){
	if (!$('#aceptoPrivacidad').is(':checked')){
		swal({ 
			title: "Registro",
			text: "Es necesario aceptar la política de privacidad para continuar",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}else if (email==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar el email de usuario",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (!validaEmail(email)){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar un email correcto",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}else if (password==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar una clave de acceso",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}else if (password!=password2){
		swal({ 
			title: "Registro",
			text: "La clave y su repetición no coinciden",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/registro1.php",
		data:"t="+tiempo+"&email="+email+"&clave="+password,
		success: function (msg) {
			$('#modal-body').html(msg);
		}
	} )		
}

function cargaContratar(){
	abreModal("Contratar", "", WEB_ROOT+"views/contratar.php");
}

function cambiaContratar(){
	$('#enlaceAcceder').attr('href', "javascript:cargaContratar();");	
}

function marcaProducto(productoId, procede){
	if (procede=='click' && document.getElementById('codPromo') && $('#codPromo').val()!='' && !$('input:radio[name=idProducto]').filter('[value='+productoId+']').prop('checked')){
		$('#codPromo').val("");
		$('#forma_pago').show();
		swal({ 
			title: "Código no apropiado",
			text: "El código de promoción indicado no se ajusta a este producto",
			type: "warning",
			timer: 3000
		});			
	}
	$('input:radio[name=idProducto]').filter('[value='+productoId+']').prop('checked', true);
	completoPagar("notexto");	
}

function registrarse(idProducto, modal){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"views/registrarse.php",
		data:"t="+tiempo+"&idProducto="+idProducto,
		success: function (msg) {
			$('#modal-title').html("Registrarse");
			$('#modal-body').html(msg);
			if (modal==1) $("#myModal").modal();
		}
	} )	
}

function validaEmail(email){
    emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (emailRegex.test(email)) return true;
    else return false;
}

function olvido(email){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	if (email==''){
		swal({ 
			title: "Restablecer clave",
			text: "Es necesario indicar el email de usuario",
			type: "warning",
			timer: 3000
		});			
		return false;
	}	
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/olvido.php",
		data:"t="+tiempo+"&email="+email,
		success: function (msg) {
			$('#modal-body').html(msg);
		}
	} )		
}

function revisaParametrosPaypal(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/revisaParametrosPaypal.php",
		data:"t="+tiempo,
		success: function (msg) {
			var data = msg.split("#");
			if (data[0]!='') $('#a3').val(data[0]);
			if (data[1]!='') $('#p3').val(data[1]);
			if (data[2]!='') $('#t3').val(data[2]);
			$('#formPayPal').submit();
		}
	} )		
}

function revisaPagoPaypal(idUsuario){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/revisaPagoPaypal.php",
		data:"t="+tiempo+"&idUsuario="+idUsuario,
		success: function (msg) {
			if (msg=='ok'){
				swal({ 
					title: "Pago correcto",
					text: "El pago ha sido realizado correctamente. Gracias",
					type: "success", 
					timer: 3000
				},function(){
					location.href='https://dinorank.com/home/';
				});
			}else{
				swal({ 
					title: "Sin datos de PayPal",
					text: "El pago parece correcto pero PayPal todavía no nos ha mandado los datos, te avisaremos cuando los recibamos",
					type: "warning",
					timer: 20000
				});					
				$('#enlaceAcceder').attr('href', "javascript:revisaPagoPaypal("+idUsuario+");");	
			}
		}
	} )		
}

function cargaGraficoPagerank(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#cargaGrafico").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/cargaGraficoPagerank.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#botonGrafico').hide(); 
			$('#cargaGrafico').html(msg); 
		}
	} )		
}

function cargaGraficoArquitectura(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#cargaGrafico").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/cargaGraficoArquitectura.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#botonGrafico').hide(); 
			$('#cargaGrafico').html(msg); 
		}
	} )		
}

function olvidoClave(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"views/olvido.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#modal-body').html(msg);
		}
	} )	
}

function cierraSesion(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/cierra.php",
		data:"t="+tiempo,
		success: function (msg) {
			location.href=WEB_ROOT;
		} 
	} )			
}

function restablece(id, clave, repite, cadena){
	if (clave==''){
		swal({ 
			title: "Restablecer clave",
			text: "La clave indicada está vacía",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (clave!=repite){
		swal({
			title: "Restablecer clave",
			text: "La clave indicada no coincide con la repetición",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else{
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$("#restablece").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/restablece.php",
			data:"t="+tiempo+"&id="+id+"&clave="+clave+"&cadena="+cadena,
			success: function (msg) {
				$('#restablece').html(msg);
			}
		} )			
	}
	
}

function completoPagar(opcion){
	if ($('#codPromo').val()!='' && opcion!='texto') return false;
	if ($('input[name=idProducto]:checked').val()>0 && $('#nombre').val()!='' && $('#direccion').val()!='' && $('#nif').val()!='' && $('#telefono').val()!='' && $('#pais').val()!='' && $('#formaPago').val()!='' && $('#ciudad').val()!='') 
	pagar($('#idUsuario').val(), $('input[name=idProducto]:checked').val(), $('#nombre').val(), $('#direccion').val(), $('#nif').val(), $('#telefono').val(), $('#pais').val(), $('#formaPago').val(), $('#ciudad').val(), $('#codPromo').val());
	else if (opcion=='texto'){
		swal({ 
			title: "Registro",
			text: "Todos los campos tienen que estar correctamente rellenos",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}
}

function pagar(id, producto, nombre, direccion, nif, telefono, pais, formaPago, ciudad, codPromo){ 
	if (producto=='' || producto=='undefined'){
		swal({ 
			title: "Registro",
			text: "Es necesario elegir un tipo de producto",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (nombre==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar un nombre para generar la factura",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (direccion==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar una dirección paga generar la factura",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (pais==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar el pais",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (telefono==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar una teléfono de contacto",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (formaPago==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar la forma de pago", 
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (ciudad==''){
		swal({ 
			title: "Registro",
			text: "Es necesario indicar la ciudad",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	if (producto==5){
//		$('#formTPV').html("<input type='button' value='Activar acceso de prueba' onClick='javascript:activaPrueba(id);'>");
	}else{
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$("#formTPV").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/pagar.php",
			data:"t="+tiempo+"&id="+id+"&producto="+producto+"&nombre="+nombre+"&direccion="+direccion+"&nif="+nif+"&telefono="+telefono+"&pais_id="+pais+"&formaPago="+formaPago+"&ciudad="+ciudad+"&codPromo="+codPromo,
			success: function (msg) {
				$('#formTPV').html(msg);
			}
		} )		
	}
}

function activaPrueba(id){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/activaPrueba.php",
		data:"t="+tiempo+"&id="+id,
		success: function (msg) {
			if (msg=='error' || msg==''){
				swal({ 
					title: "ERROR",
					text: "Se ha producido un error",
					type: "warning",
					timer: 3000
				});					
			}else{
				swal({ 
					title: "Prueba activada",
					text: "Acceso de prueba activado hasta "+msg,
					type: "success",
					timer: 3000
				},function(){
					location.href=WEB_ROOT+'home/';
				});					
			}
		}
	} )			
}

function goToByScroll(id){
	
	/*$('.parallax').animate({
		scrollTop: arrScroll[id]},
		'slow');*/

	var posicion=$('#'+id).offset().top-$('#aboveFondo').offset().top;		
	$('.parallax').animate({
		scrollTop: posicion},
		'slow');
}

function cambiarClave(){ 
	clave=$('#clave').val();
	nuevaClave=$('#nuevaClave').val();
	nuevaClave2=$('#nuevaClave2').val();
	if (clave==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar la clave actual",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (nuevaClave==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar la nueva clave",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (nuevaClave!=nuevaClave2){
		swal({ 
			title: "ERROR",
			text: "La nueva clave y su repetición no coinciden",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/cambioClave.php",
		data:"t="+tiempo+"&clave="+clave+"&nuevaClave="+nuevaClave,
		success: function (msg) {
			if (msg=='ok'){
				swal({ 
					title: "Cambio de clave",
					text: "El cambio de clave se ha REALIZADO CORRECTAMENTE",
					type: "success",
					timer: 3000
				});		
				$('#clave').val("");
				$('#nuevaClave').val("");
				$('#nuevaClave2').val("");				
			}else if (msg=='noclave'){
				swal({ 
					title: "ERROR",
					text: "La clave actual NO ES CORRECTA",
					type: "warning",
					timer: 3000
				});	
			}else if (msg=='vacio'){
				swal({ 
					title: "ERROR",
					text: "Las claves indicadas están vacías",
					type: "warning",
					timer: 3000
				});					
			}else{
				swal({ 
					title: "ERROR",
					text: "No se ha podido cambiar la clave",
					type: "warning",
					timer: 3000
				});					
			}
		}
	} )		
}



function cambiarDatosF(){ 
	nombre=$('#fiscalNombre').val();
	direccion=$('#fiscalDireccion').val();
	nif=$('#fiscalNif').val();
	telefono=$('#telefono').val();
	if (nombre==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar tu nombre fiscal o personal",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (direccion==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar la direccion completa de cara a la facturación",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (nif==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar el NIF / CIF de cara a la facturación",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (telefono==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar el teléfono",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/cambioDatosFiscales.php",
		data:"t="+tiempo+"&nombre="+nombre+"&direccion="+direccion+"&nif="+nif,
		success: function (msg) {
			if (msg=='ok'){
				swal({ 
					title: "Datos fiscales",
					text: "El cambio de datos fiscales se ha REALIZADO CORRECTAMENTE",
					type: "success",
					timer: 3000
				});		
			}else{
				swal({ 
					title: "ERROR",
					text: "No se ha podido cambiar los datos fiscales",
					type: "warning",
					timer: 3000
				});					
			}
		}
	} )		
}

function agregaDominio(){ 
	dominio=$('#nuevoDominio').val();
	pais=$('#pais').val();
	idioma=$('#idioma').val();
	if (dominio==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar un dominio",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (dominio.indexOf('.')<2){ 
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar un dominio válido",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	var html=$("#agregarProyecto").html();
	$("#agregarProyecto").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/agregaDominio.php",
		data:"t="+tiempo+"&dominio="+dominio+"&pais="+pais+"&idioma="+idioma,
		success: function (msg) {
			if (msg=='ok'){
				
				var nowtime = new Date();
				var tiempo = nowtime.getTime();
				$.ajax( { 
					type:"POST", url:WEB_ROOT+"views/proyectos.php",
					data:"t="+tiempo,
					success: function (msg) {
						$('#proyectos').html(msg);
					}
				})
				$('#nuevoDominio').val("");
				swal({ 
					title: "Dominio agregado",
					text: "El nuevo dominio se ha AGREGADO CORRECTAMENTE",
					type: "success",
					timer: 3000
				});		
			}else{
				swal({ 
					title: "ERROR",
					text: "No se ha podido agregar el nuevo dominio",
					type: "warning",
					timer: 3000 
				});					
			}
			$("#agregarProyecto").html(html);	
		}
	} )	
}

function eliminaSite(id){ 
	swal({
		title: "¿Eliminar proyecto?",
		text: "Los datos del proyecto serán eliminados, ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

   if (isConfirm){
  
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/eliminaDominio.php",
			data:"t="+tiempo+"&id="+id,
			success: function (msg) {
				if (msg=='ok'){
					var nowtime = new Date();
					var tiempo = nowtime.getTime();
					$.ajax( {
						type:"POST", url:WEB_ROOT+"views/proyectos.php",
						data:"t="+tiempo,
						success: function (msg) {
							$('#proyectos').html(msg);
						}
					});			
					sweet("Dominio eliminado", "El dominio y sus datos han sido eliminados", "success", 3000);
				}else sweet("ERROR", "No se ha podido eliminar el dominio", "warning", 3000);
			}
		} )	   

    }
 });

}

function cambiaProyecto(id){
	document.getElementById("selectProyecto").value = id;
	seleccionProyecto(id);
}

function seleccionProyecto(id){ 
	if (id=='-1'){
		location.href=WEB_ROOT+"usuario/#nuevo_proyecto";
		return;
	}
	var htmlAnt=$("#menuSelectProyecto").html();
	$("#menuSelectProyecto").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/seleccionaProyecto.php",
		data:"t="+tiempo+"&id="+id,
		success: function (msg) {
			if (id>0){
				if (msg=='ok'){
					location.reload();
					swal({ 
						title: "Proyecto seleccionado",
						text: "El proyecto ha sido SELECCIONADO CORRECTAMENTE",
						type: "success",
						timer: 1000
					});		
				}else{
					swal({ 
						title: "ERROR",
						text: "No se ha podido seleccionar el proyecto",
						type: "warning",
						timer: 3000
					});					
				}
			}
			$("#menuSelectProyecto").html(htmlAnt);
		}
	} )		
}

function agregaKeyword(){
	keyword=$('#keyword').val();
	swal({
		title: "¿Agregar keyword?",
		text: "Vas a agregar las keyword indicadas, ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

   if (isConfirm){
		var html=$("#tablaKeywords").html();
		$("#tablaKeywords").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", 
			url:WEB_ROOT+"ajax/agregarKeyword.php",
			data:"t="+tiempo+"&keyword="+keyword,
			success: function (msg) {
				if (msg=='ok'){
					var nowtime = new Date();
					var tiempo = nowtime.getTime();
					$.ajax( {
						type:"POST", url:WEB_ROOT+"ajax/tablaTrackingConfig.php",
						data:"t="+tiempo,
						success: function (msg) {
							$('#tablaKeywords').html(msg);
						}
					} )						
					sweet("Keywords agregadas", "Las keyword indicadas han sido agregadas", "success", 3000);
					$('#keyword').val("");
				}else if (msg=='nosite') sweet("ERROR", "No hay ningún proyecto seleccionado", "warning", 3000);
				else if (msg=='nokeyword') sweet("ERROR", "No se ha especificado una keyword válida", "warning", 3000);
				else if (msg=='limites') sweet("ERROR", "No todas las keywords se han agregado. Se han alcanzado los límites de uso.", "warning", 3000);
				else sweet("ERROR", "No se ha podido agregar la keyword", "warning", 3000);
				$("#tablaKeywords").html(html);
			}
		} )	   

    }
 });	
}

function eliminaKeyword(keyword, id){
	swal({
		title: "¿Eliminar keyword?",
		text: "Vas a eliminar la keyword '"+keyword+"' y todos sus datos registrados ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

   if (isConfirm){
  
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/eliminarKeyword.php",
			data:"t="+tiempo+"&id="+id,
			success: function (msg) {
				if (msg=='ok'){
					var nowtime = new Date();
					var tiempo = nowtime.getTime();
					$.ajax( {
						type:"POST", url:WEB_ROOT+"ajax/tablaTrackingConfig.php",
						data:"t="+tiempo,
						success: function (msg) {
							$('#tablaKeywords').html(msg);
						}
					} )						
					sweet("Keyword eliminada", "La keyword '"+keyword+"' ha sido eliminada", "success", 3000);
				}else if (msg=='nosite') sweet("ERROR", "No hay ningún proyecto seleccionado", "warning", 3000);
				else sweet("ERROR", "No se ha podido agregar la keyword", "warning", 3000);
			}
		} )	   

    }
 });	
 
}

function muestraCanibalizacion(id){
	if (document.getElementById(id).style.display=='block') document.getElementById(id).style.display='none';
	else document.getElementById(id).style.display='block';
}

function muestraGrafica(id, tiempo, muestraModal){
	cadenaIds=id;
	for(i=1;i<=$('#contador').val();i++){
		if ($('#checkK'+i).prop('checked') && $('#checkK'+i).val()!=id) cadenaIds=cadenaIds+','+$('#checkK'+i).val();
	}

	if (muestraModal=='si') $("#myModal").modal();
	

	var nowtime = new Date();
	var t = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/keywordGrafica.php",
		data:"t="+t+"&cadenaIds="+cadenaIds+"&tiempo="+tiempo,
		success: function (msg) {
			$('#modal-body').html(msg);
		}
	} )		
}
function verCanibalizaciones(){
	$(".regNoCanibalizado").fadeOut("slow");
	$(".tablaCanibaliza").fadeIn("slow");
	$("#verTodo").show();
	$("#verCanibalizaciones").hide();	
}
function verTodo(){
	$(".regNoCanibalizado").fadeIn("slow");
	$(".tablaCanibaliza").fadeOut("slow");
	$("#verTodo").hide();
	$("#verCanibalizaciones").show();
}

async function buscaKeyword(orden){
	keyword=$('#buscaKeyword').val();
	if (orden=='') orden=$('#orden').val();
	//$("#tablaK").fadeOut("slow");
	//await sleep(300);
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#tablaK").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/buscaKeyword.php",
		data:"t="+tiempo+"&keyword="+keyword+"&orden="+orden,
		success: function (msg) {
			$('#tablaK').html(msg);
			//$("#tablaK").fadeIn("slow");
		}
	} )		
}

function agregaAlerta(){
	alertaKeyword=$('#alertaKeyword').val();
	alertaComparador=$('#alertaComparador').val();
	alertaPosicion=$('#alertaPosicion').val();
	if (alertaKeyword==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario seleccionar una keyword",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (alertaComparador==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario seleccionar un comparador",
			type: "warning",
			timer: 3000
		});			
		return false;
	}else if (alertaPosicion==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario seleccionar una posición",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/agregaAlerta.php",
		data:"t="+tiempo+"&keyword="+alertaKeyword+"&comparador="+alertaComparador+"&posicion="+alertaPosicion,
		success: function (msg) {
			if (msg=='ok'){
				muestraAlertas();
				swal({ 
					title: "Alerta agregada",
					text: "La alerta se ha agregado correctamente",
					type: "success",
					timer: 3000
				});			
			}else{
				swal({ 
					title: "ERROR",
					text: msg,
					type: "warning",
					timer: 3000
				});			
			}
		}
	} )		
}

function muestraAlertas(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#tablaAlertas").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/alertas.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#tablaAlertas').html(msg);
		}
	} )		
}

function eliminarAlerta(id, keyword){
	swal({
		title: "¿Eliminar alerta?",
		text: "Vas a eliminar la alerta de la keyword "+keyword+" ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

	if (isConfirm){	
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/eliminarAlerta.php",
			data:"t="+tiempo+"&id="+id,
			success: function (msg) {
				if (msg=='ok'){
					muestraAlertas();
					swal({ 
						title: "Alerta eliminada",
						text: "La alerta se ha eliminado correctamente",
						type: "success",
						timer: 3000
					});			
				}else{
					swal({ 
						title: "ERROR",
						text: msg,
						type: "warning",
						timer: 3000
					});			
				}
				
			}
		} )	
	}});	
}

function agregaNota(){
	idPos=$("#idPos").val();
	nota=$("#nuevaNota").val(); 
	if (nota==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar la anotación a agregar",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#myModal2 #modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/agregaNota.php",
		data:"t="+tiempo+"&nota="+nota+"&idPos="+idPos,
		success: function (msg) {
			if (msg=='ok'){
				muestraAlertas();
				swal({ 
					title: "Anotación agregada",
					text: "La anotación se ha agregado correctamente",
					type: "success",
					timer: 3000
				});
			}else{
				swal({ 
					title: "ERROR",
					text: "Ha habido un error al agregar la anotación",
					type: "warning",
					timer: 3000
				});			
			}		
			muestraNotas(idPos);
		}
	} )			
}

function eliminarNota(idNota, idPos){
	swal({
		title: "¿Eliminar anotación?",
		text: "La anotación se eliminará para siempre ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

	if (isConfirm){		
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$("#myModal2 #modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/eliminarNota.php",
			data:"t="+tiempo+"&idNota="+idNota,
			success: function (msg) {
				muestraNotas(idPos);
				if (msg=='ok'){
					swal({ 
						title: "Anotación eliminada",
						text: "La anotación se ha eliminado correctamente",
						type: "success",
						timer: 3000
					});
				}else{
					swal({ 
						title: "ERROR",
						text: "Ha habido un error al eliminar la anotación",
						type: "warning",
						timer: 3000
					});			
				}		
			}
		} )			
	}});	
}

function muestraNotas(id){
	if (id.indexOf('/')>0) var cadena="&keywordPosicionId="+id;
	else var cadena="&idPos="+id;
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#myModal2 #modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/keywordNotas.php",
		data:"t="+tiempo+cadena,
		success: function (msg) {
			$('#myModal2 #modal-body').html(msg);
		}
	} )		
}

function comienzaScraping(){
	swal({
		title: "Comenzar rastreo",
		text: "Los datos de rastreo anteriores, si existen, serán reemplazados por los nuevos ¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

	if (isConfirm){	
		$('#botonScrapear').hide(); 
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/comienzaScraping.php",
			data:"t="+tiempo,
			success: function (msg) {
				msg=msg.trim();
				if (msg=='ok'){
					swal({ 
						title: "Rastreo activado",
						text: "El proceso de rastreo se ha puesto en cola y comenzará muy pronto.",
						type: "success",
						timer: 3000
					},function(){
						location.reload();
					});
				}else if (msg=='existe'){
					swal({ 
						title: "ERROR",
						text: "Ya existe un rastreo pendiente",
						type: "warning",
						timer: 3000
					});			
				}else{
					swal({ 
						title: "ERROR",
						text: "Ha habido un error al activar el rastreo",
						type: "warning",
						timer: 3000
					});			
				}
			}
		} )			
	}});
}

async function scrapingEnCursoOld(){ 
	while ($("#finalizado").val()==0){
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/scrapingEnCurso.php",
			data:"t="+tiempo,
			async: false,
			success: function (msg) {
				msg=msg.trim();
				if (msg=='fin'){
					$("#finalizado").val("1");
					swal({ 
						title: "Rastreo finalizado",
						text: "El proceso de rastreo ha finalizado correctamente.",
						type: "success",
						timer: 3000
					},function(){
						location.reload();
					});
				}else{
					$("#enCurso").html(msg);
					$("#finalizado").val("0");
				}
			}
		} )	
		if ($("#finalizado").val()==0) await sleep(1000); 
	}
}

async function scrapingEnCurso(){ 
	var inicio=0;
	var i=0;
	var j=0;
	while ($("#finalizado").val()==0){
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/scrapingEnCurso.php",
			data:"t="+tiempo+"&inicio="+inicio,
			async: false,
			success: function (msg) {
				inicio=1;
				msg=msg.trim();
				if (msg=='fin'){
					$("#finalizado").val("1");
					swal({ 
						title: "Rastreo finalizado",
						text: "El proceso de rastreo ha finalizado correctamente.",
						type: "success",
						timer: 3000
					},function(){
						location.reload();
					});
				}else{
					var data = msg.split("#*#");
					if (data.length>2){
						var texto=data[0];
						var mensaje=data[1];
						var numUrls=data[2];
						if (j==0) $("#enCurso").html(texto);
						else $("#enCurso").prepend(texto);
						$("#finalizado").val("0");
						$("#mensaje").html(mensaje);
						$("#numUrls").html(numUrls);
						j++;
					}else if (i==0){
						var mensaje=data[1];
						if (mensaje!='') var texto='';
						else var texto=data[0];
						$("#enCurso").html(texto);
						$("#mensaje").html(mensaje);
					}else{
						var mensaje=data[1];
						$("#mensaje").html(mensaje);
					}
				}
			}
		} )	
		i++;
		if ($("#finalizado").val()==0) await sleep(500); 
	}
}

function interrumpeScraper(){ 
	swal({
		title: "¿Interrumpir el rastreo?",
		text: "Los datos rastreados se perderán\n¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

   if (isConfirm){
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/interrumpeScraping.php",
			data:"t="+tiempo,
			success: function (msg) {
				if (msg=='ok'){
					$("#finalizado").val("1");
					swal({ 
						title: "Rastreo interrumpido",
						text: "El proceso de rastreo ha sido interrumpido.",
						type: "success",
						timer: 3000
					},function(){
						location.reload();
					});				
				}else{
					swal({ 
						title: "Error",
						text: "Se ha producido un error en la interrupción",
						type: "warning",
						timer: 3000
					});	
				}
			}
		} )		   
    }
 });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function listaPagerank(orden, tipo){
	$('#listaUrls').fadeOut("fast");
	texto=$("#textoBuscar").val();

	if(orden=='') orden="pagerank DESC";
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#listaUrls").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/pagerank.php",
		data:"t="+tiempo+"&texto="+texto+"&orden="+orden+"&tipo="+tipo,
		success: function (msg) {
			$('#listaUrls').html(msg);
			$('#listaUrls').fadeIn("slow");
		}
	} )		
}
  
function audit(tipo){
	$('input[type="button"]').removeClass('botonGris');
	if (tipo=='estados') $('#onPageEstados').toggleClass('botonGris');
	if (tipo=='titles')  $('#onPageTitles').toggleClass('botonGris');
	if (tipo=='h1')  $('#onPageH1').toggleClass('botonGris');
	if (tipo=='noindex')  $('#onPageNoindex').toggleClass('botonGris');
	if (tipo=='meta')  $('#onPageMeta').toggleClass('botonGris');
	if (tipo=='ilinks')  $('#onPageILinks').toggleClass('botonGris'); 
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#divOnPage").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/seoonpage.php",
		data:"t="+tiempo+"&tipo="+tipo,
		success: function (msg) {
			$('#divOnPage').html(msg);
		}
	} )		
}  

function auditDatos(tipo, subtipo, id){ 
	$('.subOnPage').removeClass('botonGris');
	$('#'+id).toggleClass('botonGris');
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#datasubonpage").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/seoonpagedatos.php",
		data:"t="+tiempo+"&tipo="+tipo+"&subtipo="+subtipo,
		success: function (msg) {
			$('#datasubonpage').html(msg);
		}
	} )		
}

function densidadProminencia(){ 
	keyword=$('#keyword').val();
	url=$('#url').val();
	if (keyword.length<3){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar una keyword correcta",
			type: "warning",
			timer: 3000
		});			
		return false;		
	}
	textoEspera=$('#textoEspera').val();
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#dataDensidad").html("<img src='"+WEB_ROOT+"img/loading.gif'><br>"+textoEspera);
	$("#nuevoAnalisis").html("");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/densidad.php",
		data:"t="+tiempo+"&keyword="+keyword+"&url="+url+"&modo=nuevo",
		success: function (msg) {
			$('#dataDensidad').html(msg);
		}
	} )		
}

function recuperaAnalisis(id){ 
	textoEspera=$('#textoEspera').val();
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$('#nuevoAnalisis').hide();
	$("#dataDensidad").html("<img src='"+WEB_ROOT+"img/loading.gif'><br>"+textoEspera);
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/densidad.php",
		data:"t="+tiempo+"&id="+id+"&modo=recupera",
		success: function (msg) {
			$('#dataDensidad').html(msg);
		}
	} )		
}

function loadg(idDiv, texto){ 
	$("#"+idDiv).html("<img src='"+WEB_ROOT+"img/loading.gif'><br>"+texto);
}

function accesoGoogle(){
	
	heigthT=(window.innerHeight-700)/2;
	widthT=(window.innerWidth-700)/2;
	window.open(WEB_ROOT+"ajax/accesoGoogle.php", "_blank", "toolbar=no,scrollbars=no,resizable=no,top="+heigthT+",left="+widthT+",width=700,height=700");
	
	/*$('#modal-body').html("<iframe src='"+WEB_ROOT+"ajax/accesoGoogle.php' width='100%'></iframe>");
	$("#myModal").modal();*/
	
	/*var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#modal-body").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/accesoGoogle.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#modal-body').html(msg);
			$("#myModal").modal();
		}
	} )			*/
}

function mostrarCapa(id){
	if (document.getElementById(id).style.display=='block'){
		$("#"+id).fadeOut("slow");
		setTimeout(function(){ document.getElementById(id).style.display='none'; }, 600);
	}else{
		$("#"+id).fadeIn("slow");
		setTimeout(function(){ document.getElementById(id).style.display='block'; }, 600);		
	}
	//if (document.getElementById(id).style.display=='block') document.getElementById(id).style.display='none';
	//else document.getElementById(id).style.display='block';
}

function muestraAnalisis(capa, id){
	
	$('.analisisButton').removeClass('botonGris');
	$('#'+id).toggleClass('botonGris');
	
	if (capa=='canibalizaciones'){
		id1="capaCanibalizaciones";
		id2="capaOportunidades";
		id3="capaKeywords";
	}else if (capa=='oportunidades'){
		id1="capaOportunidades";
		id2="capaCanibalizaciones";
		id3="capaKeywords";
	}else if (capa=='keywords'){
		id1="capaKeywords";
		id2="capaCanibalizaciones";
		id3="capaOportunidades";
	}
	if (document.getElementById(id1).style.display!='block') document.getElementById(id1).style.display='block';
	if (document.getElementById(id2).style.display!='none') document.getElementById(id2).style.display='none';
	if (document.getElementById(id3).style.display!='none') document.getElementById(id3).style.display='none';	
}

function buscaKeywords(){
	fechaIni=$('#fechaIni').val();
	fechaFin=$('#fechaFin').val();
	texto=$('#texto').val();

	if(fechaIni=='' || fechaFin==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar un intervalo de fechas",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	if( fechaIni>fechaFin){
		swal({ 
			title: "ERROR",
			text: "La fecha de fin tiene que ser superior o igual a la fecha de inicio",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#buscaKeywords").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/buscaKeywords.php",
		data:"t="+tiempo+"&fechaIni="+fechaIni+"&fechaFin="+fechaFin+"&texto="+texto,
		success: function (msg) {
			$('#buscaKeywords').html(msg);
		}
	} )		
}
function buscaThinContent(){
	fechaIni=$('#fechaIni').val();
	fechaFin=$('#fechaFin').val();

	if(fechaIni=='' || fechaFin==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar un intervalo de fechas",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	if( fechaIni>fechaFin){
		swal({ 
			title: "ERROR",
			text: "La fecha de fin tiene que ser superior o igual a la fecha de inicio",
			type: "warning",
			timer: 3000
		});			
		return false;
	}
	
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#listadoThin").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/buscaThinContent.php",
		data:"t="+tiempo+"&fechaIni="+fechaIni+"&fechaFin="+fechaFin,
		success: function (msg) {
			$('#listadoThin').html(msg);
		}
	} )		
}

function cargaCanibalizaciones(){
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#capaCanibalizaciones").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/canibalizaciones.php",
		data:"t="+tiempo,
		success: function (msg) {
			$('#capaCanibalizaciones').html(msg);
		}
	} )		
}

var enviandoSoporte=false;

function enviaSoporte(){
	if (enviandoSoporte) return false;
	enviandoSoporte=true;
	tipo=$('#tipo').val();
	texto=$('#texto').val();
	if(tipo=='' || texto==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario el tipo de incidencia a comunicar y la descripción de la misma",
			type: "warning",
			timer: 3000
		});			
	}	
	
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$("#abrirTicket").html("<div style='text-align:center;'><img src='"+WEB_ROOT+"img/loading.gif'></div>");
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/abrirSoporte.php",
		data:"t="+tiempo+"&texto="+texto+"&tipo="+tipo,
		success: function (msg) {
			if (msg.substr(0, 5)=='ERROR'){
				swal({ 
					title: "ERROR",
					text: msg.substr(5),
					type: "warning",
					timer: 3000
				});	
			}else{
				swal({ 
					title: "Soporte insertado",
					text: msg,
					type: "success",
					timer: 2000
				},function(){
					location.reload();
				});	
			}
			enviandoSoporte=false;
		}
	} )		
}

function rTicket(id){
	texto=$('#respuesta'+id).val();
	if(texto==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar la respuesta a la incidencia",
			type: "warning",
			timer: 3000
		});			
	}		
	var nowtime = new Date();
	var tiempo = nowtime.getTime();
	$.ajax( {
		type:"POST", url:WEB_ROOT+"ajax/rTicket.php",
		data:"t="+tiempo+"&texto="+texto+"&id="+id,
		success: function (msg) {
			if (msg.substr(0, 5)=='ERROR'){
				swal({ 
					title: "ERROR",
					text: msg.substr(5),
					type: "warning",
					timer: 3000
				});	
			}else{
				swal({ 
					title: "Soporte",
					text: msg,
					type: "success",
					timer: 2000
				},function(){
					location.reload();
				});	
			}
		}
	} )			
}
var numSwitch=0;
function switchPrecio(){
	numSwitch++;
	if (numSwitch==2){
		numSwitch=0;
		return false;
	}
	if ($('#switchCheck').val()=='ano'){
		$('#switchCheck').val("mes");
		muestra="mes";
		oculta="año";
	}else{ 
		$('#switchCheck').val("ano");
		muestra="año";
		oculta="mes";
	}

	$('.precio'+muestra).show();
	$('.precio'+oculta).hide();
	
}

var arrNodes=[];
function marcar(id){
	
	arrNodes.forEach(desmarcar);
	
	
	var a = document.getElementById("svgObject");

	var svgItem = a.getElementById(id);		
/*
	div.transition().duration(200).style("opacity", .9);		 
	div.html(svgItem.getAttribute("name")).style("left", (svgItem.getAttribute("cx")) + "px").style("top", (svgItem.getAttribute("cy") - 28) + "px");	
*/

	if (!arrNodes[id]) arrNodes[id]=[];
	arrNodes[id]['style']=svgItem.getAttribute("style");
	arrNodes[id]['r']=svgItem.getAttribute("r");		
	arrNodes[id]['id']=id;		
	
	//svgItem.setAttribute("style", "fill:black;stroke:red;stroke-width:3px;");		
	//svgItem.setAttribute("r", "10");		
	svgItem.setAttribute("style", "stroke:yellow;stroke-width:3px;");		
	location.href='#canvas';
}

function desmarcar(item){
	arrNodes.splice(item.id, 1);
	
	var a = document.getElementById("svgObject");
	var svgItem = a.getElementById(item.id);
	svgItem.setAttribute("style", item.style);		
	svgItem.setAttribute("r", item.r);		
}

function agregarEnlaceExterno(){
	urls=$('#urlsEnlaces').val();
	if (urls==''){
		swal({ 
			title: "ERROR",
			text: "Es necesario indicar las urls en las que se ubican los enlaces",
			type: "warning",
			timer: 3000
		});	
		return false;
	}	
	swal({
		title: "¿Agregar urls?",
		text: "Vas a agregar las urls indicadas\n¿Seguro?",
		icon: "warning",
		buttons: [
			'No',
			'Si'
		],
		showCancelButton: true,
		confirmButtonText: 'Si, estoy seguro/a',
		cancelButtonText: "No, cancelar!",
		dangerMode: true
	},function(isConfirm){

   if (isConfirm){
		var nowtime = new Date();
		var tiempo = nowtime.getTime();
		$('#textareaOffpage').hide();
		$('#loadingOffpage').show();
		$.ajax( {
			type:"POST", url:WEB_ROOT+"ajax/agregarEnlaceExterno.php",
			data:"t="+tiempo+"&urls="+urls,
			success: function (msg) {
				if (msg=='ok'){
					swal({ 
						title: "Urls agregadas",
						text: "Las urls están a la espera de ser revisadas. Tras su revisión se incorporarán a los datos.",
						type: "success",
						timer: 4000
					});	
					$('#urlsEnlaces').val("");
				}else{
					swal({ 
						title: "ERROR",
						text: msg,
						type: "warning",
						timer: 3000
					});	
				};
				$('#textareaOffpage').show();
				$('#loadingOffpage').hide();
			}
		} )	   

    }
 });	
}
function muestraPestanaDensidad(num, id){
	$('.densidadBoton').removeClass('botonGris');
	$('#'+id).toggleClass('botonGris');
	
	$('#pestanaDensidad1').hide();
	$('#pestanaDensidad2').hide();
	$('#pestanaDensidad3').hide();
	$('#pestanaDensidad'+num).show();
}

function leyendaProminencia(){
	abreModal("¿Cómo funciona la prominencia?", "La prominencia de DinoRANK se basa en unos conceptos muy simples: <br> &nbsp; <br> - Si la keyword está en la etiqueta Title, 2 puntos<br> - Si el title comienza por la keyword, 1 punto<br> - Si además la keyword está en la primera mitad del Title, 1 punto<br> - Si la keyword está en el encabezado H1, 2 puntos<br> - Si el H1 empieza por la keyword, 1 punto<br> - Si la keyword está en al menos un encabezado H2, 1 punto<br> - Si la keyword está en el primer párrafo, 1 punto<br> - Si la keyword está en al menos una etiqueta alt de una imagen, 1 punto<br>");
}

function leyenda(tipo){
	if (tipo=='pagerank') texto="Dinobot calcula el pagerank interno de cada una de las páginas de tu web y te muestra un gráfico en el que puedes ver su mayor o menor importancia en función del pagerank recibido, en base al tamaño de cada uno de los círculos.<br>&nbsp;<br>Adicionalmente puedes ver los nodos en diferentes colores según la estructura de sus urls y más cerca de la home o más lejos, en función de la cantidad de clicks que son necesarios para llegar desde la home hasta esa página en concreto.<br>&nbsp;<br>Bajo el gráfico también se puede ver la lista de urls de tu sitio web, pudiendo señalar una de ellas en el gráfico (caso en que el nodo en cuestión pasará a color negro con borde amarillo) o hacer click en el título/url de la página y entrar a ver más detalles sobre la misma.";
	else if (tipo=='arquitectura') texto="Dinobot detecta el modo en que las páginas de tu sitio web se enlazan entre sí, generando un gráfico de arquitectura por enlazado que se basa en los primeros enlaces detectados desde la home hacia una página y las rutas más cortas en número de clicks. En este gráfico sólo aparecerán aquellas urls a las que se pueda acceder desde la home utilizando enlaces Dofollow<br>&nbsp;<br>La visualización de dicha arquitectura sirve para revisar si nuestra estrategia de enlazado interno se está efectuando correctamente, ya sea por temáticas, por determinadas jerarquías, etc ...<br>&nbsp;<br>Bajo el gráfico también se puede ver la lista de urls de tu sitio web, pudiendo señalar una de ellas en el gráfico (caso en que el nodo en cuestión pasará a color negro con borde amarillo) o hacer click en el título/url de la página y entrar a ver más detalles sobre la misma.";
	else if (tipo=='auditoria') texto="Después de que Dinobot haya recorrido tu sitio web en esta sección puedes ver una serie de elementos a tener en cuenta si queremos cuidar el seo on page de nuestro sitio web.<br>&nbsp;<br>Aquí podremos revisar aquellas urls que tienen estados de tipo 404 y que por tanto no existen pero sin embargo estamos enlazando desde otras páginas internas. Páginas con redirecciones 301 que ya no deberíamos de estar enlazando directamente, o páginas con errores de servidor (tipo 500) que debemos de revisar si existen.<br>&nbsp;<br>Asímismo también podremos ver aquellas páginas con titles, h1, metadescription, que están duplicados o directamente no existen, así como las páginas en estado noindex.";
	else if (tipo=='tracking') texto="En esta sección puedes medir de forma constante el posicionamiento de tu sitio web para las keywords que te interesa posicionar. Todos los días analizaremos la posición de cada una de las keywords y la anotaremos para que la puedas consultar en una sencilla tabla. Indica las keywords a seguir haciendo click en el botón 'Configuración keywords'<br>&nbsp;<br>Haz click en el icono de la gráfica para ver una gráfica histórica con el posicionamiento de la keyword desde que empezamos a seguirla, o marca varias keywords con el check de la izquierda y haz click en el icono de la gráfica de una de ellas para ver la gráfica comparativa. También puedes indicar anotaciones haciendo click en uno de los puntos de la gráfica, así recordarás cosas específicas de determinados momentos de una keyword.<br>&nbsp;<br>En los casos en que encontremos una canibalización, te lo indicaremos con el icono de una bomba, y podrás ver las urls que se canibalizan pulsando el botón 'Ver canibalizaciones'<br>&nbsp;<br>También puedes definir tus alertas para que te avisemos el día que una keyword supere una determinada posición o esté por debajo de otra.";
	else if (tipo=='densidad') texto="Encuentra las palabras semánticamente relacionadas y su proporción para posicionar una keyword con nuestra fórmula WDF*DF. En esta sección podrás analizar las páginas web que están posicionado en los primeros resultados para la búsqueda de una keyword concreta. Te indicaremos el listado de palabras más importantes que tienes que tener en cuenta al desarrollar tu contenido.<br>&nbsp;<br>Bajo la tabla de resultados podrás ver la estructura de encabezados de dichas páginas, así como su puntuación de prominencia para la keyword indicada en cada una de las urls.";
	else if (tipo=='thinContent') texto="En esta sección podrás localizar aquellas páginas de tu sitio web que no están recibiendo tráfico orgánico. Las páginas que no reciben tráfico orgánico por regla general no están bien posicionadas en Google lo que puede indicar que el contenido de dichas páginas no es relevante a los ojos de Google. Aparte de ello su presencia puede afectar a la arquitectura interna así como malgastar Crawl Budget, por lo que conviene gestionarlas ya sea generando contenido relevante, redireccionándolas a otras urls más relevantes para Google o directamente eliminándolas.";
	else if (tipo=='traficoOrganico') texto="Cuando más de una url de tu sitio web se posicionan para la búsqueda de una sola keyword por regla general se están restando fuerza para posicionar dado que Google no tiene totalmente claro cual es la url que mejor responde a la intención del usuario, es decir: se están canibalizando.<br>&nbsp;<br>Gestionar las canibalizaciones es algo que suele funcionar bastante bien para mejorar el posicionamiento de aquellas keywords para las que estamos canibalizando.<br>&nbsp;<br>En Dinorank cruzamos los datos de Search Console para localizar canibalizaciones y no sólo te informamos sobre ellas, sino que te aconsejamos como proceder para resolverlas. Nunca hay que olvidar que los consejos no tienen en cuenta diversas circunstancias propias de cada web y que por tanto debemos de aplicar el sentido común antes de hacer caso a dichos consejos.";
	else if (tipo=='offPage') texto="En esta sección podrás llevar un seguimiento de tus enlaces externos. Agréga la url en la que figura un enlace a tu sitio web y nosotros nos encargaremos de analizarla para incorporarlo a la base de datos de forma que puedas obtener estadísticas sobre proporción de enlaces follow y no follow, anchor text usados, etc ... <br>&nbsp;<br>También monitorizaremos el estado de los enlaces indicados para que si el enlace desaparece puedas actuar correspondientemente.";
	else if (tipo=='soporte') texto="Si tienes algún problema relacionado con Dinorank, ya sea técnico, de facturación, etc ... dínoslo por aquí y nos pondremos a solucionarlo.";
	else if (tipo=='indefinido') texto="Los clicks a la home se calculan usando la mínima ruta entre páginas a través sólo de enlaces Dofollow. En los casos en que se indica 'Indefinido' se debe a que no existe una ruta desde la home en que todos los enlaces sean Dofollow, para llegar a dicha url, o bien que dicha ruta es demasiado larga en clicks y no hemos podido localizarla.";
	abreModal("", texto);
}

function nuevoDominio(){
	var dominio=$('#nuevoDominio').val();
	if (dominio=='') return false;
	dominio=dominio.toLowerCase();
	dominio=dominio.replace("http://", "");
	dominio=dominio.replace("https://", "");
	dominio=dominio.replace("www.", "");
	if (dominio.indexOf("/")>0) dominio=dominio.substring(0, dominio.indexOf("/"));
	if (!dominioValido(dominio)){
		$('#nuevoDominio').val("");
		swal({ 
			title: "ERROR",
			text: "El dominio indicado no es correcto",
			type: "warning",
			timer: 3000
		});			
		return false; 
	}
	var puntos=dominio.split(".");
	subdominio='no';
	if (puntos.length>2){
		subdominio='si';
		if ((puntos[puntos.length-2]=='gov' || puntos[puntos.length-2]=='edu' || puntos[puntos.length-2]=='com' || puntos[puntos.length-2]=='net' || puntos[puntos.length-2]=='org' || puntos[puntos.length-2].length==2) && puntos[puntos.length-1].length==2) subdominio='no';
	}
	if (subdominio=='si'){
		swal({
			title: "¿Subdominio?",
			text: "Has especificado un subdominio, ¿deseas trabajar sólo con ese subdominio o con el dominio completo?",
			icon: "warning",
			buttons: [
				'No',
				'Si'
			],
			showCancelButton: true,
			confirmButtonText: 'Sólo el subdominio',
			cancelButtonText: "Dominio completo",
			dangerMode: true
		},function(isConfirm){

		if (!isConfirm){
			dominio=dominio.substring(dominio.indexOf(".")+1);
			$('#nuevoDominio').val(dominio);			
		}
		});			
	}
	$('#nuevoDominio').val(dominio);
	
}

function dominioValido2(domain) { 
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/); 
    return domain.match(re);
} 

function dominioValido(domain) {
  if (!domain) return false;
  var re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
  return re.test(domain);
}

function formaPago(forma){
	$('#enlace'+forma).css("border", "2px #ccc solid");
	if (forma=='stripe'){
		$('#imgStripe').attr('src', WEB_ROOT+'img/tarjetas_color.jpg');
		$('#imgPayPal').attr('src', WEB_ROOT+'img/paypal_bn.jpg');
		$('#enlacepaypal').css("border", "2px #fff solid");
	}else if (forma=='paypal'){
		$('#imgStripe').attr('src', WEB_ROOT+'img/tarjetas_bn.jpg');
		$('#imgPayPal').attr('src', WEB_ROOT+'img/paypal_color.jpg');
		$('#enlacestripe').css("border", "2px #fff solid");
	}
	$('#formaPago').val(forma);
	completoPagar("notexto");
}

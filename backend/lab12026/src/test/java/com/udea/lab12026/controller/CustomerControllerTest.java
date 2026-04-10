package com.udea.lab12026.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.udea.lab12026.dto.CustomerDTO;
import com.udea.lab12026.entity.Customer;
import com.udea.lab12026.repository.CustomerRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para CustomerController.
 *
 * Usa H2 en memoria (ver src/test/resources/application.properties).
 * Se ejecutan con @SpringBootTest para levantar el contexto completo de Spring.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
    }

    // ========================
    // HELPER: crea un cliente de prueba en la BD
    // ========================
    private Customer crearClienteEnBD(String accountNumber, String firstName, String lastName, Double balance) {
        Customer customer = new Customer();
        customer.setAccountNumber(accountNumber);
        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setBalance(balance);
        return customerRepository.save(customer);
    }

    // ========================
    // 1. Prueba: crear un cliente correctamente (POST /api/customers)
    //    Valida que el endpoint responda 200 y devuelva el cliente creado.
    // ========================
    @Test
    @Order(1)
    void testCrearCliente_respuestaExitosa() throws Exception {
        CustomerDTO dto = new CustomerDTO();
        dto.setFirstName("Carlos");
        dto.setLastName("Lopez");
        dto.setAccountNumber("ACC-1001");
        dto.setBalance(5000.0);

        MvcResult result = mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        CustomerDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), CustomerDTO.class);

        // Valida que el ID fue generado
        assertNotNull(response.getId(), "El cliente creado debe tener un ID asignado");
        assertEquals("Carlos", response.getFirstName());
        assertEquals("Lopez", response.getLastName());
        assertEquals("ACC-1001", response.getAccountNumber());
        assertEquals(5000.0, response.getBalance());
    }

    // ========================
    // 2. Prueba: obtener todos los clientes (GET /api/customers)
    //    Valida el tamaño de la lista retornada.
    // ========================
    @Test
    @Order(2)
    void testObtenerTodosLosClientes_validarTamanoLista() throws Exception {
        // Insertamos 3 clientes directamente en BD
        crearClienteEnBD("ACC-2001", "Ana", "Martinez", 1000.0);
        crearClienteEnBD("ACC-2002", "Luis", "Garcia", 2000.0);
        crearClienteEnBD("ACC-2003", "Maria", "Perez", 3000.0);

        MvcResult result = mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andReturn();

        List<?> lista = objectMapper.readValue(
                result.getResponse().getContentAsString(), List.class);

        // Valida que se retornen exactamente 3 clientes
        assertEquals(3, lista.size(), "Debe retornar exactamente 3 clientes");
    }

    // ========================
    // 3. Prueba: obtener un cliente por ID (GET /api/customers/{id})
    //    Valida que el cliente retornado sea correcto.
    // ========================
    @Test
    @Order(3)
    void testObtenerClientePorId_datosCorrectos() throws Exception {
        Customer saved = crearClienteEnBD("ACC-3001", "Pedro", "Ramirez", 7500.0);

        MvcResult result = mockMvc.perform(get("/api/customers/" + saved.getId()))
                .andExpect(status().isOk())
                .andReturn();

        CustomerDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), CustomerDTO.class);

        assertEquals("Pedro", response.getFirstName());
        assertEquals("Ramirez", response.getLastName());
        assertEquals("ACC-3001", response.getAccountNumber());
        assertEquals(7500.0, response.getBalance());
    }

    // ========================
    // 4. Prueba: validar formato del número de cuenta con regex
    //    Verifica que el accountNumber siga el patrón esperado (letras-números).
    // ========================
    @Test
    @Order(4)
    void testFormatoNumeroCuenta_regex() throws Exception {
        Customer saved = crearClienteEnBD("ACC-4001", "Sofia", "Diaz", 3200.0);

        MvcResult result = mockMvc.perform(get("/api/customers/" + saved.getId()))
                .andExpect(status().isOk())
                .andReturn();

        CustomerDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), CustomerDTO.class);

        // Valida que el número de cuenta cumpla el patrón ACC-XXXX
        String regex = "^[A-Z]{2,5}-\\d{3,10}$";
        assertTrue(response.getAccountNumber().matches(regex),
                "El número de cuenta debe cumplir el formato: " + regex
                        + ", pero fue: " + response.getAccountNumber());
    }

    // ========================
    // 5. Prueba: validar que el nombre no sea vacío ni nulo
    //    Verifica que los campos de texto retornados sean válidos.
    // ========================
    @Test
    @Order(5)
    void testCamposTexto_noVaciosNiNulos() throws Exception {
        Customer saved = crearClienteEnBD("ACC-5001", "Laura", "Torres", 1500.0);

        MvcResult result = mockMvc.perform(get("/api/customers/" + saved.getId()))
                .andExpect(status().isOk())
                .andReturn();

        CustomerDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), CustomerDTO.class);

        // Valida que firstName y lastName no sean nulos ni vacíos
        assertNotNull(response.getFirstName(), "firstName no debe ser nulo");
        assertNotNull(response.getLastName(), "lastName no debe ser nulo");
        assertFalse(response.getFirstName().isEmpty(), "firstName no debe estar vacío");
        assertFalse(response.getLastName().isEmpty(), "lastName no debe estar vacío");
    }

    // ========================
    // 6. Prueba: validar que el balance sea un número positivo
    //    Verifica que el saldo retornado sea mayor que cero.
    // ========================
    @Test
    @Order(6)
    void testBalance_esPositivo() throws Exception {
        Customer saved = crearClienteEnBD("ACC-6001", "Jorge", "Mendoza", 9999.99);

        MvcResult result = mockMvc.perform(get("/api/customers/" + saved.getId()))
                .andExpect(status().isOk())
                .andReturn();

        CustomerDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), CustomerDTO.class);

        assertTrue(response.getBalance() > 0,
                "El balance debe ser positivo, pero fue: " + response.getBalance());
    }

    // ========================
    // 7. Prueba: lista vacía cuando no hay clientes
    //    Verifica que GET /api/customers retorne lista vacía si la BD está limpia.
    // ========================
    @Test
    @Order(7)
    void testListaVacia_cuandoNoHayClientes() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andReturn();

        List<?> lista = objectMapper.readValue(
                result.getResponse().getContentAsString(), List.class);

        assertEquals(0, lista.size(), "La lista debe estar vacía cuando no hay clientes");
    }

    // ========================
    // 8. Prueba de rendimiento: medir tiempo de respuesta de GET /api/customers
    //    Verifica que la respuesta se obtenga en menos de 2 segundos.
    // ========================
    @Test
    @Order(8)
    void testRendimiento_obtenerClientesEnMenosDe2Segundos() throws Exception {
        // Insertamos varios clientes para simular carga
        for (int i = 0; i < 50; i++) {
            crearClienteEnBD("ACC-80" + String.format("%02d", i), "User" + i, "Test" + i, 100.0 * i);
        }

        long inicio = System.currentTimeMillis();

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk());

        long fin = System.currentTimeMillis();
        long tiempoMs = fin - inicio;

        // Verifica que la respuesta se obtenga en menos de 2000 ms
        assertTrue(tiempoMs < 2000,
                "El endpoint GET /api/customers tardó " + tiempoMs + " ms, debe ser < 2000 ms");
    }

    // ========================
    // 9. Prueba: el content-type de la respuesta debe ser JSON
    //     Valida que el servidor retorne application/json.
    // ========================
    @Test
    @Order(9)
    void testContentType_esJson() throws Exception {
        crearClienteEnBD("ACC-1010", "Diana", "Ruiz", 4500.0);

        mockMvc.perform(get("/api/customers"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}

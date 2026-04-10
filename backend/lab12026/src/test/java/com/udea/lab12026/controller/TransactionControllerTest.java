package com.udea.lab12026.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.udea.lab12026.dto.TransactionDTO;
import com.udea.lab12026.entity.Customer;
import com.udea.lab12026.repository.CustomerRepository;
import com.udea.lab12026.repository.TransactionRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de integración para TransactionController.
 *
 * Usa H2 en memoria. Cada prueba limpia los datos antes de ejecutarse.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        customerRepository.deleteAll();
    }

    // ========================
    // HELPER: crea dos clientes de prueba (remitente y receptor)
    // ========================
    private Customer[] crearParDeClientes() {
        Customer sender = new Customer();
        sender.setAccountNumber("ACC-SENDER-001");
        sender.setFirstName("Remitente");
        sender.setLastName("Test");
        sender.setBalance(10000.0);
        sender = customerRepository.save(sender);

        Customer receiver = new Customer();
        receiver.setAccountNumber("ACC-RECEIVER-001");
        receiver.setFirstName("Receptor");
        receiver.setLastName("Test");
        receiver.setBalance(5000.0);
        receiver = customerRepository.save(receiver);

        return new Customer[]{sender, receiver};
    }

    // ========================
    // 1. Prueba: transferencia exitosa (POST /api/transactions)
    //    Valida que se cree la transacción y se retornen los datos correctos.
    // ========================
    @Test
    @Order(1)
    void testTransferenciaExitosa() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(1500.0);
        dto.setTimestamp(LocalDateTime.now());

        MvcResult result = mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        TransactionDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), TransactionDTO.class);

        // Valida que la transacción fue creada con ID
        assertNotNull(response.getId(), "La transacción debe tener un ID asignado");
        assertEquals("ACC-SENDER-001", response.getSenderAccountNumber());
        assertEquals("ACC-RECEIVER-001", response.getReceiverAccountNumber());
        assertEquals(1500.0, response.getAmount());
    }

    // ========================
    // 2. Prueba: los saldos se actualizan correctamente después de transferir
    //    Verifica que el remitente pierde y el receptor gana el monto.
    // ========================
    @Test
    @Order(2)
    void testSaldosActualizadosDespuesDeTransferencia() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(3000.0);
        dto.setTimestamp(LocalDateTime.now());

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        // Verifica saldos en BD
        Customer senderActualizado = customerRepository.findByAccountNumber("ACC-SENDER-001").orElseThrow();
        Customer receiverActualizado = customerRepository.findByAccountNumber("ACC-RECEIVER-001").orElseThrow();

        assertEquals(7000.0, senderActualizado.getBalance(),
                "El remitente debería tener 10000 - 3000 = 7000");
        assertEquals(8000.0, receiverActualizado.getBalance(),
                "El receptor debería tener 5000 + 3000 = 8000");
    }

    // ========================
    // 3. Prueba: transferencia con saldo insuficiente retorna 400
    //    Valida el manejo de error cuando no hay fondos suficientes.
    // ========================
    @Test
    @Order(3)
    void testTransferencia_saldoInsuficiente_retorna400() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(99999.0); // Más que el saldo del remitente
        dto.setTimestamp(LocalDateTime.now());

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // ========================
    // 4. Prueba: transferencia con cuenta inexistente retorna 400
    //    Valida el error cuando la cuenta del remitente no existe.
    // ========================
    @Test
    @Order(4)
    void testTransferencia_cuentaInexistente_retorna400() throws Exception {
        crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber("ACC-NO-EXISTE");
        dto.setReceiverAccountNumber("ACC-RECEIVER-001");
        dto.setAmount(100.0);
        dto.setTimestamp(LocalDateTime.now());

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    // ========================
    // 5. Prueba: obtener todas las transacciones (GET /api/transactions)
    //    Valida el tamaño de la lista retornada.
    // ========================
    @Test
    @Order(5)
    void testObtenerTodasLasTransacciones_validarTamano() throws Exception {
        Customer[] clientes = crearParDeClientes();

        // Realizamos 2 transferencias
        for (int i = 0; i < 2; i++) {
            TransactionDTO dto = new TransactionDTO();
            dto.setSenderAccountNumber(clientes[0].getAccountNumber());
            dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
            dto.setAmount(500.0);
            dto.setTimestamp(LocalDateTime.now());

            mockMvc.perform(post("/api/transactions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk());
        }

        MvcResult result = mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andReturn();

        List<?> lista = objectMapper.readValue(
                result.getResponse().getContentAsString(), List.class);

        assertEquals(2, lista.size(), "Deben existir exactamente 2 transacciones");
    }

    // ========================
    // 6. Prueba: obtener transacciones por cuenta (GET /api/transactions/{accountNumber})
    //    Valida que filtra correctamente por número de cuenta.
    // ========================
    @Test
    @Order(6)
    void testObtenerTransaccionesPorCuenta() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(200.0);
        dto.setTimestamp(LocalDateTime.now());

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        MvcResult result = mockMvc.perform(get("/api/transactions/ACC-SENDER-001"))
                .andExpect(status().isOk())
                .andReturn();

        List<?> lista = objectMapper.readValue(
                result.getResponse().getContentAsString(), List.class);

        // Debe retornar al menos 1 transacción para esa cuenta
        assertTrue(lista.size() >= 1,
                "Debe haber al menos 1 transacción para la cuenta ACC-SENDER-001");
    }

    // ========================
    // 7. Prueba: validar formato de números de cuenta en la transacción
    //    Usa regex para verificar que los accountNumbers cumplan el patrón.
    // ========================
    @Test
    @Order(7)
    void testFormatoCuentasEnTransaccion_regex() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(750.0);
        dto.setTimestamp(LocalDateTime.now());

        MvcResult result = mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        TransactionDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), TransactionDTO.class);

        // Valida que las cuentas cumplan con el patrón ACC-XXXXX-NNN
        String regex = "^ACC-[A-Z]+-\\d{3}$";
        assertTrue(response.getSenderAccountNumber().matches(regex),
                "La cuenta remitente debe cumplir el regex: " + regex);
        assertTrue(response.getReceiverAccountNumber().matches(regex),
                "La cuenta receptora debe cumplir el regex: " + regex);
    }

    // ========================
    // 8. Prueba: el monto de la transacción debe ser positivo
    //    Valida que el amount retornado sea mayor que cero.
    // ========================
    @Test
    @Order(8)
    void testMontoTransaccion_esPositivo() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(250.0);
        dto.setTimestamp(LocalDateTime.now());

        MvcResult result = mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn();

        TransactionDTO response = objectMapper.readValue(
                result.getResponse().getContentAsString(), TransactionDTO.class);

        assertTrue(response.getAmount() > 0,
                "El monto de la transacción debe ser positivo, fue: " + response.getAmount());
    }

    // ========================
    // 9. Prueba: lista vacía cuando no hay transacciones
    //    Verifica que GET /api/transactions retorne lista vacía si no hay datos.
    // ========================
    @Test
    @Order(9)
    void testListaVacia_sinTransacciones() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andReturn();

        List<?> lista = objectMapper.readValue(
                result.getResponse().getContentAsString(), List.class);

        assertEquals(0, lista.size(), "La lista debe estar vacía cuando no hay transacciones");
    }

    // ========================
    // 10. Prueba de rendimiento: medir tiempo de respuesta de POST /api/transactions
    //     Verifica que la transferencia se complete en menos de 2 segundos.
    // ========================
    @Test
    @Order(10)
    void testRendimiento_transferenciasEnMenosDe2Segundos() throws Exception {
        Customer[] clientes = crearParDeClientes();

        TransactionDTO dto = new TransactionDTO();
        dto.setSenderAccountNumber(clientes[0].getAccountNumber());
        dto.setReceiverAccountNumber(clientes[1].getAccountNumber());
        dto.setAmount(100.0);
        dto.setTimestamp(LocalDateTime.now());

        long inicio = System.currentTimeMillis();

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        long fin = System.currentTimeMillis();
        long tiempoMs = fin - inicio;

        assertTrue(tiempoMs < 2000,
                "La transferencia tardó " + tiempoMs + " ms, debe ser < 2000 ms");
    }

    // ========================
    // 11. Prueba: content-type de la respuesta es JSON
    //     Valida que el servidor retorne application/json.
    // ========================
    @Test
    @Order(11)
    void testContentType_esJson() throws Exception {
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}

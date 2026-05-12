import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/custom-orders")
public class CustomOrdersServlet extends HttpServlet {

    // GET - load all custom orders
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();
        StringBuilder json = new StringBuilder("[");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM custom_orders ORDER BY id DESC");
            ResultSet rs = ps.executeQuery();
            boolean first = true;
            while (rs.next()) { 
                if (!first) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"customerName\":\"").append(escape(rs.getString("customer_name"))).append("\",")
                    .append("\"customerEmail\":\"").append(escape(rs.getString("customer_email"))).append("\",")
                    .append("\"productType\":\"").append(escape(rs.getString("product_type"))).append("\",")
                    .append("\"quantity\":").append(rs.getInt("quantity")).append(",")
                    .append("\"color\":\"").append(escape(rs.getString("color"))).append("\",")
                    .append("\"budget\":\"").append(escape(rs.getString("budget"))).append("\",")
                    .append("\"notes\":\"").append(escape(rs.getString("notes"))).append("\"")
                    .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        json.append("]");
        out.print(json.toString());
    }

    // POST - submit a new custom order
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        PrintWriter out = response.getWriter();

        String name   = request.getParameter("customerName");
        String email  = request.getParameter("customerEmail");
        String type   = request.getParameter("productType");
        int    qty    = Integer.parseInt(request.getParameter("quantity"));
        String color  = request.getParameter("color");
        String budget = request.getParameter("budget");
        String notes  = request.getParameter("notes");

        // Use CustomOrder for OOP demonstration
        CustomOrder order = new CustomOrder(0, name, email, type, qty, color, budget, notes);

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                "INSERT INTO custom_orders (customer_name, customer_email, product_type, quantity, color, budget, notes) VALUES (?,?,?,?,?,?,?)");
            ps.setString(1, order.getCustomerName());
            ps.setString(2, order.getCustomerEmail());
            ps.setString(3, order.getProductType());
            ps.setInt(4,    order.getQuantity());
            ps.setString(5, order.getColor());
            ps.setString(6, order.getBudget());
            ps.setString(7, order.getNotes());
            ps.executeUpdate();
            out.print("Custom order submitted successfully");
        } catch (SQLException e) {
            e.printStackTrace();
            out.print("Error: " + e.getMessage());
        }
    }

    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
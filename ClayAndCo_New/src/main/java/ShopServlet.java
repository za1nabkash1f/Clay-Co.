import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/products")
public class ShopServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();
        StringBuilder json = new StringBuilder("[");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM products");
            ResultSet rs = ps.executeQuery();
            boolean first = true;
            while (rs.next()) {
                if (!first) json.append(",");
                json.append("{")
                    .append("\"id\":").append(rs.getInt("id")).append(",")
                    .append("\"name\":\"").append(escape(rs.getString("name"))).append("\",")
                    .append("\"category\":\"").append(escape(rs.getString("category"))).append("\",")
                    .append("\"price\":").append(rs.getDouble("price")).append(",")
                    .append("\"rating\":").append(rs.getDouble("rating")).append(",")
                    .append("\"reviews\":").append(rs.getInt("reviews")).append(",")
                    .append("\"stock\":").append(rs.getInt("stock")).append(",")
                    .append("\"image\":\"").append(escape(rs.getString("image"))).append("\",")
                    .append("\"description\":\"").append(escape(rs.getString("description"))).append("\"")
                    .append("}");
                first = false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        json.append("]");
        out.print(json.toString());
    }

    // Escapes special characters so they don't break the JSON string
    private String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet("/contact")
public class ContactServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Get form parameters
        String name      = request.getParameter("name");
        String email     = request.getParameter("email");
        String subject   = request.getParameter("subject");
        String message   = request.getParameter("message");

        // Basic server-side validation
        if (name == null || name.trim().isEmpty() ||
            email == null || email.trim().isEmpty()) {
            response.setContentType("text/html");
            response.getWriter().println("Error: Name and Email are required.");
            return;
        }

        String sql = "INSERT INTO contact_messages (name, email, subject, message) " +
                     "VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, name.trim());
            stmt.setString(2, email.trim());
            stmt.setString(3, subject != null ? subject.trim() : "");
            stmt.setString(4, message != null ? message.trim() : "");

            int rows = stmt.executeUpdate();

            response.setContentType("text/html");
            if (rows > 0) {
                response.getWriter().println("Thank you! Your message has been sent.");
            } else {
                response.getWriter().println("Something went wrong. Please try again.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setContentType("text/html");
            response.getWriter().println("Database error: " + e.getMessage());
        }
    }
}
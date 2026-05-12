import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

@WebServlet("/api/bookings")
public class BookingsServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        response.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = response.getWriter();

        int workshopId  = Integer.parseInt(request.getParameter("workshopId"));
        String fullName = request.getParameter("fullName");
        String email    = request.getParameter("email");
        int spots       = Integer.parseInt(request.getParameter("spots"));

        try (Connection conn = DBConnection.getConnection()) {
            // Check available spots first
            PreparedStatement check = conn.prepareStatement(
                "SELECT available_spots FROM workshops WHERE id = ?");
            check.setInt(1, workshopId);
            ResultSet rs = check.executeQuery();

            if (rs.next()) {
                int available = rs.getInt("available_spots");
                if (spots > available) {
                    out.print("Not enough spots available");
                    return;
                }

                // Insert booking
                PreparedStatement insert = conn.prepareStatement(
                    "INSERT INTO bookings (workshop_id, full_name, email, spots) VALUES (?,?,?,?)");
                insert.setInt(1, workshopId);
                insert.setString(2, fullName);
                insert.setString(3, email);
                insert.setInt(4, spots);
                insert.executeUpdate();

                // Update available spots
                PreparedStatement update = conn.prepareStatement(
                    "UPDATE workshops SET available_spots = available_spots - ? WHERE id = ?");
                update.setInt(1, spots);
                update.setInt(2, workshopId);
                update.executeUpdate();

                out.print("Booking confirmed");
            } else {
                out.print("Workshop not found");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            out.print("Error: " + e.getMessage());
        }
    }
}

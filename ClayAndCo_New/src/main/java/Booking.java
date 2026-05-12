public class Booking {

    private int    id;
    private int    workshopId;
    private String fullName;
    private String email;
    private int    spots;

    public Booking() {}

    public Booking(int id, int workshopId, String fullName, String email, int spots) {
        this.id         = id;
        this.workshopId = workshopId;
        this.fullName   = fullName;
        this.email      = email;
        this.spots      = spots;
    }

    // Getters
    public int    getId()         { return id; }
    public int    getWorkshopId() { return workshopId; }
    public String getFullName()   { return fullName; }
    public String getEmail()      { return email; }
    public int    getSpots()      { return spots; }

    // Setters
    public void setId(int id)                   { this.id         = id; }
    public void setWorkshopId(int workshopId)   { this.workshopId = workshopId; }
    public void setFullName(String fullName)    { this.fullName   = fullName; }
    public void setEmail(String email)          { this.email      = email; }
    public void setSpots(int spots)             { this.spots      = spots; }
}
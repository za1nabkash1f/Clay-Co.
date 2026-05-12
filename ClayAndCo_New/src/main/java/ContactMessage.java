public class ContactMessage {

    private int    id;
    private String name;
    private String email;
    private String subject;
    private String message;

    public ContactMessage() {}

    public ContactMessage(int id, String name, String email, String subject, String message) {
        this.id      = id;
        this.name    = name;
        this.email   = email;
        this.subject = subject;
        this.message = message;
    }

    // Getters
    public int    getId()      { return id; }
    public String getName()    { return name; }
    public String getEmail()   { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }

    // Setters
    public void setId(int id)               { this.id      = id; }
    public void setName(String name)        { this.name    = name; }
    public void setEmail(String email)      { this.email   = email; }
    public void setSubject(String subject)  { this.subject = subject; }
    public void setMessage(String message)  { this.message = message; }
}

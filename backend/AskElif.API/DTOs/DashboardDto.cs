namespace AskElif.API.DTOs;

public class DashboardDto
{
    public int KnowledgeCount { get; set; }

    public int ConversationCount { get; set; }

    public int MessageCount { get; set; }

    public int UnknownQuestionCount { get; set; }

    public List<RecentConversationDto> RecentConversations { get; set; } = new();

    public List<UnknownQuestionDto> RecentUnknownQuestions { get; set; } = new();
}

public class RecentConversationDto
{
    public int Id { get; set; }

    public string Question { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}

public class UnknownQuestionDto
{
    public int Id { get; set; }

    public string Question { get; set; } = string.Empty;

    public bool IsResolved { get; set; }
}
namespace AskElif.API.DTOs;

public class DashboardDto
{
    public int KnowledgeCount { get; set; }

    public int ConversationCount { get; set; }

    public int MessageCount { get; set; }

    public int UnknownQuestionCount { get; set; }
}
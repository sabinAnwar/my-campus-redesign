const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('📰 Seeding translated news...');
    await prisma.news.deleteMany({});
    
    const newsItems = [
      {
        slug: 'welcome-2025',
        title: 'Willkommen im Wintersemester 2025',
        titleDe: 'Willkommen im Wintersemester 2025',
        titleEn: 'Welcome to the Winter Semester 2025',
        content: 'Wir freuen uns, alle neuen und zurückkehrenden Studierenden auf dem Campus begrüßen zu dürfen. Dieses Semester bietet viele neue Möglichkeiten, Workshops und Networking-Events.',
        contentDe: 'Wir freuen uns, alle neuen und zurückkehrenden Studierenden auf dem Campus begrüßen zu dürfen. Dieses Semester bietet viele neue Möglichkeiten, Workshops und Networking-Events für IU Dual-Studierende.',
        contentEn: 'We are excited to welcome all new and returning students to the campus. This semester brings many new opportunities, workshops, and networking events for IU Dual students.',
        category: 'Campus Leben',
        categoryDe: 'Campus Leben',
        categoryEn: 'Campus Life',
        featured: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1523050853064-8557227cd6d4?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'exam-prep-workshop',
        title: 'Workshop-Reihe zur Prüfungsvorbereitung',
        titleDe: 'Workshop-Reihe zur Prüfungsvorbereitung',
        titleEn: 'Exam Preparation Workshop Series',
        content: 'Prüfungsangst? Nehmen Sie an unserer kommenden Workshop-Reihe teil, die sich auf effektive Lerntechniken, Zeitmanagement und Prüfungssimulationen konzentriert.',
        contentDe: 'Prüfungsangst? Nehmen Sie an unserer kommenden Workshop-Reihe teil, die sich auf effektive Lerntechniken, Zeitmanagement und Prüfungssimulationen konzentriert.',
        contentEn: 'Struggling with exam anxiety? Join our upcoming workshop series focusing on effective study techniques, time management, and mock exam scenarios.',
        category: 'Akademisch',
        categoryDe: 'Akademisch',
        categoryEn: 'Academic',
        featured: false,
        coverImageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'career-day-2025',
        title: 'IU Career Day: Treffen Sie Praxispartner',
        titleDe: 'IU Career Day: Treffen Sie Praxispartner',
        titleEn: 'IU Career Day: Connect with Praxis Partners',
        content: 'Über 50 Praxispartner werden auf dem Campus sein. Bringen Sie Ihren Lebenslauf mit und erkunden Sie spannende Karrieremöglichkeiten für das nächste Jahr.',
        contentDe: 'Über 50 Praxispartner werden auf dem Campus sein. Bringen Sie Ihren Lebenslauf mit und erkunden Sie spannende Karrieremöglichkeiten und potenzielle Plätze für das nächste Jahr.',
        contentEn: 'Over 50 praxis partners will be on campus to meet you. Bring your CV and explore exciting career opportunities and potential placements for next year.',
        category: 'Karriere',
        categoryDe: 'Karriere',
        categoryEn: 'Career',
        featured: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800'
      },
      {
        slug: 'new-library-resources',
        title: 'Erweiterter Zugriff auf digitale Bibliotheksressourcen',
        titleDe: 'Erweiterter Zugriff auf digitale Bibliotheksressourcen',
        titleEn: 'Expanded Digital Library Access',
        content: 'Wir haben unser Abonnement für wichtige wissenschaftliche Zeitschriften erneuert. Über das IU-Bibliotheksportal haben Sie nun Zugriff auf über 10.000 neue digitale Ressourcen.',
        contentDe: 'Wir haben unser Abonnement für wichtige wissenschaftliche Zeitschriften erneuert. Über das IU-Bibliotheksportal haben Sie nun Zugriff auf über 10.000 neue digitale Ressourcen.',
        contentEn: 'We have renewed our subscription to major scientific journals. You now have access to over 10,000 new digital resources via the IU library portal.',
        category: 'Ressourcen',
        categoryDe: 'Ressourcen',
        categoryEn: 'Resources',
        featured: false,
        coverImageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800'
      }
    ];

    for (const item of newsItems) {
      await prisma.news.create({
        data: item
      });
    }
    console.log('✅ 4 News-Einträge mit Übersetzungen erfolgreich erstellt');
}

main().catch(console.error).finally(() => prisma.$disconnect());

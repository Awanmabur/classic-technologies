const obj = {
            "classic-events-pro": {
                title: "Classic Events Pro (Event Management & Ticketing)",
                desc: "A premium event platform with organizer tools, promoter tracking, ticketing, QR check-in, and admin controls — built end-to-end for production use.",
                tags: ["Events", "Ticketing", "Promoters", "Admin", "Analytics"],
                img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
                live: "https://classicpro.events",
                code: "https://github.com/Awanmabur/classic-events",
                roles: [
                    { icon: "fa-solid fa-code", title: "Full-Stack Ownership", points: ["Designed and built the system end-to-end", "UI/UX, backend, database, and integrations", "Production-first architecture decisions"] },
                    { icon: "fa-solid fa-diagram-project", title: "System Architecture", points: ["Modular controllers + clean routing", "Scalable patterns for events/tickets/orders", "Admin tools and permissions structure"] },
                    { icon: "fa-solid fa-users-gear", title: "Roles & Dashboards", points: ["Organizer dashboard (events, tickets, sales)", "Promoter dashboard (links, sales, earnings)", "Admin moderation & approvals"] },
                    { icon: "fa-solid fa-credit-card", title: "Payments + Orders", points: ["Checkout and order records", "Receipts and status tracking", "Refund-ready structure and reconciliation"] },
                    { icon: "fa-solid fa-qrcode", title: "Ticket QR + Check-in", points: ["QR generation per ticket", "Validation flow for entry scanning", "Anti-fraud checks + status updates"] },
                    { icon: "fa-solid fa-shield-halved", title: "Security & Hardening", points: ["Validation & safe input handling", "Rate limiting and safe auth patterns", "Audit-friendly logs and error handling"] }
                ],
                features: [
                    { icon: "fa-solid fa-calendar-check", title: "Event Creation & Publishing", desc: "Create events, sessions, ticket types, capacity rules, visibility, schedules, and promo logic." },
                    { icon: "fa-solid fa-ticket", title: "Ticketing & Orders", desc: "Ticket categories, pricing tiers, buyer details, order confirmation, and receipt-ready structure." },
                    { icon: "fa-solid fa-users", title: "Promoter System", desc: "Share links, ref codes, attribution, earnings calculation, payouts-ready records and reporting." },
                    { icon: "fa-solid fa-qrcode", title: "QR Tickets + Gate Validation", desc: "QR ticket generation and entry verification workflow with unique IDs and validation state." },
                    { icon: "fa-solid fa-clipboard-check", title: "Admin Moderation Tools", desc: "Approve events, edit requests, manage users/promoters, and enforce platform rules." },
                    { icon: "fa-solid fa-chart-line", title: "Analytics & Performance", desc: "Sales insights, event trends, promoter performance, and peak-day reliability improvements." }
                ],
                challenges: [
                    {
                        title: "Problem: Promoter attribution accuracy",
                        lines: [
                            { type: "fix", text: "Solution: consistent query params + server-side attribution checks on checkout/order creation." },
                            { type: "good", text: "Result: reliable promoter reporting and fewer mis-attributions." }
                        ]
                    },
                    {
                        title: "Problem: Peak traffic on event day",
                        lines: [
                            { type: "fix", text: "Solution: optimized pages, reduced payloads, safe caching patterns, and controlled DB queries." },
                            { type: "good", text: "Result: stable performance under heavy load." }
                        ]
                    }
                ]
            },
            "classic-trip": {
                title: "Classic Trip (Travel Booking & Ticketing)",
                desc: "A premium booking system for bus/train/flights/hotels with operator dashboards, schedules, inventory, tickets, and promoter/affiliate tracking.",
                tags: ["Booking", "Tickets", "Inventory", "Promoters", "Admin"],
                img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=80",
                live: "https://awanmabur.github.io/classic-trip",
                code: "https://github.com/Awanmabur/classic-trip",
                roles: [
                    { icon: "fa-solid fa-code", title: "Full-Stack Build From Scratch", points: ["Built frontend and backend end-to-end", "Designed booking logic + operator workflows", "Implemented reusable UI components"] },
                    { icon: "fa-solid fa-sitemap", title: "Booking Architecture", points: ["Unified booking model for multiple providers", "Reservation → confirmation lifecycle", "Extensible provider integration pattern"] },
                    { icon: "fa-solid fa-calendar-days", title: "Schedules & Availability", points: ["Schedule creation and seat/room slots", "Availability checks + locking patterns", "Admin/operator controls"] },
                    { icon: "fa-solid fa-user-shield", title: "Auth + Roles", points: ["Customer accounts & history", "Operator dashboards & permissions", "Admin oversight patterns"] },
                    { icon: "fa-solid fa-users", title: "Promoters / Affiliate Tracking", points: ["Referral links and attribution", "Commission-ready accounting logs", "Promo performance reporting"] },
                    { icon: "fa-solid fa-shield-halved", title: "Production Quality", points: ["Validation + security checks", "Error handling + logging", "Performance-first data access"] }
                ],
                features: [
                    { icon: "fa-solid fa-magnifying-glass", title: "Search & Filters", desc: "Routes, dates, pricing, class/type, and availability filters in a clean booking UI." },
                    { icon: "fa-solid fa-ticket", title: "Tickets & Booking References", desc: "Booking reference IDs, confirmation flows, and receipt-ready records." },
                    { icon: "fa-solid fa-layer-group", title: "Multi-Provider Booking", desc: "Bus/train/flight/hotel structure designed to scale and add providers easily." },
                    { icon: "fa-solid fa-building", title: "Operator Dashboard", desc: "Manage schedules, inventory, pricing, and view sales/booking reports." },
                    { icon: "fa-solid fa-users", title: "Promoters / Referrals", desc: "Share links, attribution on checkout, and promoter reporting & earnings structure." },
                    { icon: "fa-solid fa-chart-line", title: "Reports & Admin Controls", desc: "Operational insights, booking trends, and admin moderation patterns." }
                ],
                challenges: [
                    {
                        title: "Problem: Avoiding overbooking",
                        lines: [
                            { type: "fix", text: "Solution: availability locking + confirmation steps with controlled inventory updates." },
                            { type: "good", text: "Result: fewer conflicts and reliable seat/room allocation." }
                        ]
                    },
                    {
                        title: "Problem: Multiple provider flow complexity",
                        lines: [
                            { type: "fix", text: "Solution: a single booking lifecycle with provider-specific metadata and adapters." },
                            { type: "good", text: "Result: easier scaling to new transport/hotel partners." }
                        ]
                    }
                ]
            },
            "classic-education-suite": {
                title: "Classic Education Suite (Multi-Tenant SaaS)",
                desc: "A premium education SaaS built for universities and schools: admissions, portals, finance-ready structure, LMS-ready patterns, analytics, and a School Profiles Directory listing institutions and services.",
                tags: ["SaaS", "Education", "Multi-tenant", "Portals", "School Profiles"],
                img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
                live: "",
                code: "",
                roles: [
                    { icon: "fa-solid fa-code", title: "Full-Stack SaaS Delivery", points: ["Built tenant-ready platform end-to-end", "Frontend UX + backend logic + data layer", "Reusable components and clean UI patterns"] },
                    { icon: "fa-solid fa-diagram-project", title: "Multi-Tenancy & Isolation", points: ["Tenant routing + branding hooks", "Clean boundaries per institution", "Scalable onboarding structure"] },
                    { icon: "fa-solid fa-users-gear", title: "Role-Based Portals (RBAC)", points: ["Student/Staff/Lecturer/Admin portals", "Permission-controlled menus and actions", "Safe admin operations"] },
                    { icon: "fa-solid fa-file-signature", title: "Admissions Workflows", points: ["Online applications + review", "Approval → enrollment flows", "Audit-friendly status transitions"] },
                    { icon: "fa-solid fa-shield-halved", title: "Security & Data Integrity", points: ["Validation rules + safe inputs", "Consistent schemas and constraints", "Logs + error handling patterns"] },
                    { icon: "fa-solid fa-chart-column", title: "Analytics Foundation", points: ["Dashboards and reporting hooks", "Institution-level metrics", "Growth-ready architecture"] }
                ],
                features: [
                    { icon: "fa-solid fa-building-columns", title: "Multi-Tenant Institutions", desc: "Tenant setup, branding, configurations and scalable onboarding patterns per school/university." },
                    { icon: "fa-solid fa-user-graduate", title: "Admissions + Enrollment", desc: "Online application forms, review pipeline, approvals, and student onboarding flows." },
                    { icon: "fa-solid fa-users-gear", title: "Role Portals (RBAC)", desc: "Students, lecturers, staff, finance/admin portals with permission-based experiences." },
                    { icon: "fa-solid fa-id-card", title: "Student Records & Services", desc: "Profiles, documents, requests, department structures, and service workflows." },
                    { icon: "fa-solid fa-school", title: "School Profiles Directory", desc: "A directory listing schools/universities with public profiles, programs/services, and discovery UX." },
                    { icon: "fa-solid fa-chart-line", title: "Reports & Analytics", desc: "Dashboards for operations, admissions insights, and reporting-ready architecture." }
                ],
                challenges: [
                    {
                        title: "Problem: Strong tenant separation",
                        lines: [
                            { type: "fix", text: "Solution: tenant-aware routing and tenant configuration boundaries across the system." },
                            { type: "good", text: "Result: safer isolation and easier onboarding of new institutions." }
                        ]
                    },
                    {
                        title: "Problem: Complex roles and permissions",
                        lines: [
                            { type: "fix", text: "Solution: structured RBAC with clear portal views and admin-controlled privileges." },
                            { type: "good", text: "Result: fewer permission bugs and smoother UX per role." }
                        ]
                    }
                ]
            },
            "classic-mart": {
                title: "Classic Mart (E-commerce Platform)",
                desc: "A premium e-commerce platform with catalog, cart, checkout, orders, admin tools, and SEO-focused structure.",
                tags: ["E-commerce", "Payments", "Orders", "SEO", "Admin"],
                img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80",
                live: "https://awanmabur.github.io/classicmart/",
                code: "https://github.com/Awanmabur/classicmart",
                roles: [
                    { icon: "fa-solid fa-code", title: "Full-Stack Build", points: ["Built storefront + admin from scratch", "Backend APIs and DB models", "Checkout and order lifecycle"] },
                    { icon: "fa-solid fa-cart-shopping", title: "Storefront UX", points: ["Product pages", "Cart UX", "Search/filter structure"] },
                    { icon: "fa-solid fa-box", title: "Orders & Inventory", points: ["Order statuses and tracking", "Stock control patterns", "Admin operations"] },
                    { icon: "fa-solid fa-credit-card", title: "Checkout & Payments", points: ["Payment-ready architecture", "Receipt records", "Conversion-friendly flows"] },
                    { icon: "fa-solid fa-magnifying-glass", title: "SEO & Performance", points: ["SEO-first page structure", "Optimized assets patterns", "Fast browsing UX"] },
                    { icon: "fa-solid fa-shield-halved", title: "Security & Stability", points: ["Validation and safe inputs", "Auth/account security patterns", "Error handling and logs"] }
                ],
                features: [
                    { icon: "fa-solid fa-layer-group", title: "Product Catalog", desc: "Categories, product variants, pricing, images, and SEO-ready product pages." },
                    { icon: "fa-solid fa-cart-shopping", title: "Cart & Checkout", desc: "Cart persistence, checkout flow, totals calculations, and order creation." },
                    { icon: "fa-solid fa-receipt", title: "Orders & Receipts", desc: "Order confirmation, buyer records, receipts and order status lifecycle." },
                    { icon: "fa-solid fa-boxes-stacked", title: "Inventory Patterns", desc: "Stock tracking structures, admin adjustments, and low-stock readiness." },
                    { icon: "fa-solid fa-user", title: "Customer Accounts", desc: "Profiles, addresses, order history and account management structure." },
                    { icon: "fa-solid fa-chart-line", title: "Admin Reports", desc: "Sales trends, product insights and management dashboards foundation." }
                ],
                challenges: [
                    { title: "Problem: Checkout drop-offs", lines: [{ type: "fix", text: "Solution: simplified checkout steps and stronger CTA flow design." }, { type: "good", text: "Result: improved conversion and less friction." }] },
                    { title: "Problem: Admin daily operations complexity", lines: [{ type: "fix", text: "Solution: clean admin screens and consistent management components." }, { type: "good", text: "Result: faster operations and fewer errors." }] }
                ]
            },
            "juba-rentals": {
                title: "Juba Rentals (Real Estate & Vehicles Marketplace)",
                desc: "A premium listings platform for cars, houses and land with verification workflows, agent tools, and inquiry/lead management.",
                tags: ["Marketplace", "Real Estate", "Vehicles", "Leads", "Admin"],
                img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
                live: "https://awanmabur.github.io/jubarentals/",
                code: "https://github.com/Awanmabur/jubarentals"
            },
            "chariot-technologies": {
                title: "Chariot Technologies (Mobility Platform)",
                desc: "A premium mobility platform connecting riders and drivers with safety patterns, scalable backend design, and ops dashboards foundation.",
                tags: ["Mobility", "Platform", "SaaS", "Safety", "Ops"],
                img: "https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?auto=format&fit=crop&w=1400&q=80",
                live: "https://www.chariot.ug",
                code: "https://github.com/Chariot-Technologies/chariot-technologies"
            }
        }; console.log(JSON.stringify(obj));
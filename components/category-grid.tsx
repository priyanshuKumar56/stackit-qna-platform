"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Users, HelpCircle, Lightbulb, UserCheck, BookOpen } from "lucide-react"

const categories = [
  {
    title: "Fin Q&A",
    description: "Get inspired and engage in Fin discussions",
    icon: MessageSquare,
    href: "/category/fin-qa",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Fin Community",
    description: "Make the most of using Fin",
    icon: Users,
    href: "/category/fin-community",
    color: "bg-gray-50 text-gray-600",
  },
  {
    title: "Product Q&A",
    description: "Find answers and get expert advice",
    icon: HelpCircle,
    href: "/category/product-qa",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Product Wishlist",
    description: "Suggest ideas and share upvotes",
    icon: Lightbulb,
    href: "/category/product-wishlist",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Groups",
    description: "Join a user group and connect with peers",
    icon: UserCheck,
    href: "/category/groups",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "User Tips",
    description: "See tips from users and StackIt team",
    icon: BookOpen,
    href: "/category/user-tips",
    color: "bg-blue-50 text-blue-600",
  },
]

export function CategoryGrid() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Link key={category.title} href={category.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

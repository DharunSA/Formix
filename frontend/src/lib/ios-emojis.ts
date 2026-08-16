export interface IosEmoji {
  id: string;
  name: string;
  category: "popular" | "objects" | "animals" | "expression";
  url: string;
  symbol: string;
}

export const IOS_3D_EMOJIS: IosEmoji[] = [
  {
    id: "fox",
    name: "Smart Fox Mascot",
    category: "animals",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Fox.png",
    symbol: "🦊",
  },
  {
    id: "rocket",
    name: "Rocket Launch",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
    symbol: "🚀",
  },
  {
    id: "lightbulb",
    name: "Idea Lightbulb",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png",
    symbol: "💡",
  },
  {
    id: "artist_palette",
    name: "Creative Palette",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Artist%20Palette.png",
    symbol: "🎨",
  },
  {
    id: "robot",
    name: "AI Robot Helper",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png",
    symbol: "🤖",
  },
  {
    id: "trophy",
    name: "Victory Trophy",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png",
    symbol: "🏆",
  },
  {
    id: "sparkles",
    name: "Magic Sparkles",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sparkles.png",
    symbol: "✨",
  },
  {
    id: "star",
    name: "Glowing Star",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png",
    symbol: "🌟",
  },
  {
    id: "party_popper",
    name: "Party Popper",
    category: "expression",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png",
    symbol: "🎉",
  },
  {
    id: "party_face",
    name: "Celebration Face",
    category: "expression",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Partying%20Face.png",
    symbol: "🥳",
  },
  {
    id: "headphones",
    name: "Studio Headphones",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Headphone.png",
    symbol: "🎧",
  },
  {
    id: "coffee",
    name: "Coffee Cup",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food%20and%20drink/Hot%20Beverage.png",
    symbol: "☕",
  },
  {
    id: "bullseye",
    name: "Target Goal",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Direct%20Hit.png",
    symbol: "🎯",
  },
  {
    id: "dog_face",
    name: "Happy Dog",
    category: "animals",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Dog%20Face.png",
    symbol: "🐶",
  },
  {
    id: "crystal_ball",
    name: "Magic Crystal",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Crystal%20Ball.png",
    symbol: "🔮",
  },
  {
    id: "gem",
    name: "Diamond Gem",
    category: "objects",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png",
    symbol: "💎",
  },
  {
    id: "heart",
    name: "Revolving Hearts",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Revolving%20Hearts.png",
    symbol: "💞",
  },
  {
    id: "fire",
    name: "Flame",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png",
    symbol: "🔥",
  },
  {
    id: "avocado",
    name: "Fresh Avocado",
    category: "popular",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food%20and%20drink/Avocado.png",
    symbol: "🥑",
  },
  {
    id: "ghost",
    name: "Friendly Ghost",
    category: "expression",
    url: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Ghost.png",
    symbol: "👻",
  },
];

export function getIosEmojiById(id?: string): IosEmoji | undefined {
  if (!id) return undefined;
  return IOS_3D_EMOJIS.find((e) => e.id === id);
}

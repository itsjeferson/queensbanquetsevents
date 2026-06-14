export const demoWeddingInvitation = {
  event: {
    id: 1,
    event_name: 'John & Jane',
    event_type: 'wedding',
    event_date: '2027-07-25T16:00:00',
    slug: 'john-jane',
    invite_code: 'DEMO2027',
    status: 'published',
  },
  invitation: {
    cover_image: null,
    primary_color: '#D4AF37',
    font_family: 'Playfair Display',
    dress_code: 'Formal / Black Tie Optional',
    story: {
      title: 'Our Story',
      sections: [
        { heading: 'How We Met', content: 'We met at a mutual friend\'s dinner party in 2019. John spilled wine on Jane\'s dress — she laughed, he apologized, and the rest is history.' },
        { heading: 'The Proposal', content: 'On a sunset cruise in Palawan, John got down on one knee as dolphins appeared beside the boat. Jane said yes before he finished the question.' },
        { heading: 'Our Journey', content: 'Five years of adventures, late-night talks, and building a life together have led us to this beautiful day.' },
      ],
    },
    venue: {
      ceremony: { name: 'San Agustin Church', address: 'General Luna St, Intramuros, Manila', time: '2:00 PM', map_url: 'https://maps.google.com' },
      reception: { name: 'Queens Banquet Garden Estate', address: 'Taguig City, Metro Manila', time: '4:00 PM', map_url: 'https://maps.google.com' },
    },
    program: [
      { time: '2:00 PM', title: 'Ceremony' },
      { time: '4:00 PM', title: 'Cocktail Hour' },
      { time: '5:00 PM', title: 'Reception & Dinner' },
      { time: '7:00 PM', title: 'Program & Dancing' },
    ],
    entourage: {
      principal_sponsors: ['Mr. & Mrs. Roberto Santos', 'Dr. & Dra. Elena Cruz'],
      secondary_sponsors: ['Mr. & Mrs. Miguel Reyes', 'Atty. & Mrs. Patricia Lim'],
      best_man: 'Carlos Mendoza',
      maid_of_honor: 'Isabella Torres',
      groomsmen: ['James Lee', 'Mark Rivera', 'David Kim'],
      bridesmaids: ['Sophia Cruz', 'Anna Park', 'Mia Santos'],
      ring_bearer: 'Lucas Mendoza',
      flower_girl: 'Emma Torres',
    },
    gallery: [
      { caption: 'Engagement', type: 'engagement' },
      { caption: 'Prenup', type: 'prenup' },
      { caption: 'Together', type: 'memories' },
    ],
    videos: [
      { title: 'Pre-Wedding Film', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
    gift_registry: {
      cash_gift: true,
      gcash: '0917-123-4567',
      bank: 'BDO — John Santos — 1234-5678-9012',
      preferences: 'Your presence is our present. Monetary gifts are appreciated.',
    },
    qr_enabled: 1,
  },
  guest_messages: [
    { guest_name: 'Maria Garcia', message: 'Wishing you both a lifetime of love and happiness!', created_at: '2027-06-01' },
    { guest_name: 'Pedro Reyes', message: 'Congratulations! Cannot wait to celebrate with you.', created_at: '2027-06-02' },
  ],
};

export const demoDebutInvitation = {
  ...demoWeddingInvitation,
  event: {
    ...demoWeddingInvitation.event,
    event_name: 'Maria at 18',
    event_type: 'debut',
    slug: 'maria-at-18',
    event_date: '2027-03-15T18:00:00',
  },
  invitation: {
    ...demoWeddingInvitation.invitation,
    primary_color: '#E8A0BF',
    story: {
      title: 'About Me',
      sections: [
        { heading: 'My Journey', content: 'Eighteen years of blessings, laughter, and cherished memories. Today I step into a new chapter of my life.' },
        { heading: 'Dreams Ahead', content: 'I dream of making a difference in the world, one step at a time, with the love and support of my family and friends.' },
      ],
    },
    entourage: null,
  },
};

export const demoBirthdayInvitation = {
  ...demoWeddingInvitation,
  event: {
    ...demoWeddingInvitation.event,
    event_name: "Josh's 7th Birthday",
    event_type: 'birthday',
    slug: 'josh-7th-birthday',
    event_date: '2027-08-10T14:00:00',
  },
  invitation: {
    ...demoWeddingInvitation.invitation,
    primary_color: '#FF6B6B',
    story: {
      title: 'About Josh',
      sections: [
        { heading: 'Turning Seven!', content: 'Josh loves dinosaurs, building blocks, and making everyone laugh. Join us for a fun-filled celebration!' },
      ],
    },
    entourage: null,
  },
};

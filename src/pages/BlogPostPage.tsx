import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, this would fetch data from an API based on the ID
  // For demo purposes, we'll use mock data
  const post = {
    id: id || '1',
    title: 'The Future of Sustainable Architecture in Urban Environments',
    content: `
      <p>Sustainable architecture is no longer just a trend—it's becoming a necessity as we face the challenges of climate change and urbanization. In this article, we explore how eco-friendly design is reshaping our cities and creating more livable urban spaces.</p>
      
      <h2>The Urban Challenge</h2>
      
      <p>Cities are responsible for approximately 75% of global CO2 emissions, with buildings alone accounting for nearly 40%. As urban populations continue to grow, the need for sustainable architectural solutions becomes increasingly urgent.</p>
      
      <p>Traditional urban development has often prioritized rapid growth over environmental considerations, leading to issues such as:</p>
      
      <ul>
        <li>Excessive energy consumption</li>
        <li>Poor air quality</li>
        <li>Urban heat islands</li>
        <li>Reduced biodiversity</li>
        <li>Strained infrastructure</li>
      </ul>
      
      <p>However, a new wave of sustainable urban architecture is emerging, offering innovative solutions to these challenges.</p>
      
      <h2>Key Trends in Sustainable Urban Architecture</h2>
      
      <h3>1. Vertical Forests and Green Buildings</h3>
      
      <p>Pioneered by projects like Bosco Verticale in Milan, vertical forests integrate thousands of plants and trees into high-rise buildings. These living facades provide natural insulation, improve air quality, reduce the urban heat island effect, and create habitats for birds and insects.</p>
      
      <h3>2. Adaptive Reuse</h3>
      
      <p>Rather than demolishing existing structures, adaptive reuse transforms them for new purposes. This approach significantly reduces construction waste, preserves cultural heritage, and often requires less energy than new construction.</p>
      
      <h3>3. Net-Zero Energy Buildings</h3>
      
      <p>Buildings that produce as much energy as they consume are becoming increasingly viable thanks to advances in renewable energy technology and energy-efficient design. Features such as solar panels, geothermal heating and cooling, and smart energy management systems are making net-zero energy buildings a reality in urban environments.</p>
      
      <h3>4. Biophilic Design</h3>
      
      <p>Biophilic design incorporates natural elements into built environments, recognizing the innate human connection to nature. In urban settings, this might include living walls, natural materials, abundant daylight, and views of nature. Research shows that biophilic design can improve wellbeing, productivity, and cognitive function.</p>
      
      <h2>Case Studies: Cities Leading the Way</h2>
      
      <p>Several cities around the world are already implementing innovative sustainable architecture strategies:</p>
      
      <h3>Copenhagen, Denmark</h3>
      
      <p>Copenhagen aims to be carbon-neutral by 2025, with sustainable architecture playing a key role. The city has implemented strict energy efficiency requirements for new buildings and is home to numerous innovative projects, including CopenHill, a waste-to-energy plant topped with a ski slope and hiking trail.</p>
      
      <h3>Singapore</h3>
      
      <p>Despite its dense urban environment, Singapore has earned the nickname "Garden City" through its integration of nature into architecture. Projects like Gardens by the Bay and the numerous green-certified buildings throughout the city demonstrate Singapore's commitment to sustainable urban development.</p>
      
      <h2>The Future Outlook</h2>
      
      <p>As technology continues to advance and climate concerns intensify, we can expect to see even more innovative approaches to sustainable urban architecture. Some emerging trends include:</p>
      
      <ul>
        <li>Mass timber construction for high-rise buildings</li>
        <li>3D-printed buildings using recycled materials</li>
        <li>Self-healing building materials</li>
        <li>Buildings that actively remove carbon from the atmosphere</li>
        <li>Integration of urban agriculture into architectural design</li>
      </ul>
      
      <p>The future of sustainable architecture in urban environments is not just about reducing negative environmental impacts—it's about creating buildings and cities that actively contribute to ecological and human wellbeing. By embracing innovative design strategies and technologies, architects and urban planners can transform our cities into more sustainable, resilient, and livable spaces for generations to come.</p>
    `,
    image: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
    date: 'June 15, 2023',
    author: 'Sophie Laurent',
    authorRole: 'Principal Architect',
    authorImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80',
    category: 'Sustainable Design',
    tags: ['Urban Design', 'Sustainability', 'Green Architecture', 'Future Trends'],
    relatedPosts: [
      {
        id: '4',
        title: 'Passive House Design: Principles and Benefits',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        category: 'Sustainable Design'
      },
      {
        id: '2',
        title: 'Innovative Eco-Friendly Building Materials for 2023',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1331&q=80',
        category: 'Eco Materials'
      }
    ],
    prevPost: {
      id: '6',
      title: 'The Psychology of Color in Sustainable Interior Design'
    },
    nextPost: {
      id: '2',
      title: 'Innovative Eco-Friendly Building Materials for 2023'
    }
  };

  return (
    <div>
      <PageHeader 
        title={post.title}
        backgroundImage={post.image}
      />

      <section className="py-20">
        <div className="container mx-auto px-5 md:px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Post Meta */}
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8">
                <div className="flex items-center mr-6 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  <Tag className="h-4 w-4 mr-1" />
                  <span className="text-terracotta">{post.category}</span>
                </div>
              </div>
              
              {/* Author */}
              <div className="flex items-center mb-8 p-4 bg-sage bg-opacity-10 rounded-lg">
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-600">{post.authorRole}</p>
                </div>
              </div>
              
              {/* Post Content */}
              <motion.div 
                className="prose prose-lg max-w-none mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Tags */}
              <div className="mb-8">
                <p className="font-medium mb-2">Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Share */}
              <div className="mb-12">
                <p className="font-medium mb-2">Share this article:</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-sage hover:text-terracotta transition-colors duration-300">
                    <Share2 className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              {/* Post Navigation */}
              <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                <Link 
                  to={`/blog/${post.prevPost.id}`} 
                  className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span>
                    <span className="block text-sm text-gray-500">Previous Article</span>
                    {post.prevPost.title}
                  </span>
                </Link>
                
                <Link 
                  to={`/blog/${post.nextPost.id}`} 
                  className="flex items-center text-sage hover:text-terracotta transition-colors duration-300"
                >
                  <span className="text-right">
                    <span className="block text-sm text-gray-500">Next Article</span>
                    {post.nextPost.title}
                  </span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Related Posts */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="font-playfair text-xl mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {post.relatedPosts.map((relatedPost) => (
                    <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="flex group">
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md mr-4">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-sage transition-colors duration-300">{relatedPost.title}</h4>
                        <p className="text-sm text-terracotta">{relatedPost.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Categories */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-playfair text-xl mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/blog" className="flex justify-between items-center hover:text-sage transition-colors duration-300">
                      <span>Sustainable Design</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">8</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="flex justify-between items-center hover:text-sage transition-colors duration-300">
                      <span>Eco Materials</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">5</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="flex justify-between items-center hover:text-sage transition-colors duration-300">
                      <span>Green Living</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">7</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="flex justify-between items-center hover:text-sage transition-colors duration-300">
                      <span>Architecture Trends</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">4</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;
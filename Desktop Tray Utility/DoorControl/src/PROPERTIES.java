import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;

public class PROPERTIES
{
    String[] keys, vals ;
    private int  size = 0 ;
	private long lLastModifiedDate ;
	private String GLOBALPROFILE = "";
	
	PROPERTIES(String filename) 
	{
		LOAD(filename);
	}

	private int LineCount(String filename)
	{
		int count = 0 ;
		File aFile = new File(filename);
		BufferedReader input = null;
		try 
		{
			input = new BufferedReader( new FileReader(aFile) );
			while (( input.readLine()) != null)
			{
				count++;
			}
		}
		catch (FileNotFoundException fex) 
		{
			System.out.println("PROPERTIES:LineCount:FileNotFoundException:fex: " + filename + " " + fex);
			fex.printStackTrace();
		}
		catch (IOException ioe)
		{
			System.out.println("PROPERTIES:LineCount:IOException:ioe: " + filename + " "+ioe);
			ioe.printStackTrace();
		}
		finally 
		{
			try 
			{
				if (input!= null) 
				{
			    	input.close();
			    }
				input = null;
			}
			catch (IOException ioe) 
			{
    			System.out.println("PROPERTIES:LineCount:IOException:ioe: close " + filename + " "+ioe);
			    ioe.printStackTrace();
			}
		}
		aFile = null;	
		return count;
	}

	private void SET(int i, String key, String value)
	{
		keys[i] = key ;
		vals[i] = value ;								
	}
	
	private synchronized void LOAD(String filename)
	{
		int lines = LineCount(filename)+100; // allow extra 100 items
		keys = new String[lines];
		vals = new String[lines];
		
		GLOBALPROFILE = filename;
		File aFile = new File(filename);
		BufferedReader input = null;
		try 
		{
			input = new BufferedReader( new FileReader(aFile) );
			String line = null; //not declared within while loop
			size = 0 ;
			while (( line = input.readLine()) != null)
			{
				line = line.trim();
				if((line.length()!=0) && (!line.startsWith("#")))
				{
					int ix = line.indexOf('=');
					if(ix != -1)
						SET(size, line.substring(0,ix).trim(), line.substring(ix+1).trim());
					else
						SET(size, "", line);
				}
				else
					SET(size, "", line);
				size++;
			}
			line = null ;
		}
		catch (FileNotFoundException fex) 
		{
			System.out.println("PROPERTIES:PROPERTIES:FileNotFoundException:fex: " + filename + " " + fex);
			fex.printStackTrace();
		}
		catch (IOException ioe)
		{
			System.out.println("PROPERTIES:PROPERTIES:IOException:ioe: " + filename + " "+ioe);
			ioe.printStackTrace();
		}
		finally 
		{
			try 
			{
				if (input!= null) 
				{
			    	input.close();
			    }
			}
			catch (IOException ioe) 
			{
    			System.out.println("PROPERTIES:PROPERTIES:IOException:ioe: close " + filename + " "+ioe);
			    ioe.printStackTrace();
			}
		}
		aFile = null;		
		lLastModifiedDate = FILETIMESTAMP(GLOBALPROFILE);
	}
	
	public synchronized void SAVE()
	{			
		String aContents = "";
		for(int i=0;i<size;i++)
		{
			if(keys[i].equals(""))
				aContents = aContents + vals[i] + "\r\n";
			else
				aContents = aContents + keys[i] + "=" + vals[i] + "\r\n"; 
		}
		
   		File aFile = new File(GLOBALPROFILE);
		Writer output = null;
		try 
		{
			output = new BufferedWriter( new FileWriter(aFile) );
			output.write( aContents );
			if (output != null) output.close();
		}
		catch(IOException ex)
		{
			ex.printStackTrace();
		}
	}
	
	private String GETPHYSICALENV(String key)
	{
	    if((key == null)||(key.length()==0)) return null ;
		String s = System.getProperty(key);
		if(s == null)
		{
			for(int i=0;i<size;i++)
			{
				if(keys[i].equals(key))
					s = vals[i];
			}
		}
		return s ;
	}

    public synchronized String GETENV(String key)
    {
        String s = GETPHYSICALENV(key);
        if(s != null)
        {
            for(int i=0;i<10;i++)
            {
                int i1 = s.indexOf("[");
                int i2 = s.indexOf("]");
                if((i1 != -1)&&(i2 != -1)&&(i1<i2))
                {
        			String s1 = s.substring(0,i1);
        			String s2 = s.substring(i1+1,i2);
        	    	String s3 = s.substring(i2+1);
                    String s4 = GETPHYSICALENV(s2);
                    if(s4 == null) s4 = "" ;
                    s = s1 + s4 + s3 ;            
                }
                else
                    break;
            }
        }
        return s; 
    }

    public int GETENVINT(String key)
    {
        return Integer.valueOf(GETENV(key)).intValue();
    }
    
    public void SETENV(String key, String value)
    {
    	boolean done = false ;
		for(int i=0;i<size;i++)
		{
			if(keys[i].equals(key))
			{
				vals[i] = value;
				done = true ;
			}
		}
		if(!done)
		{
			SET(size, key, value);
			size++ ;
		}
    }
    
	public void REFRESH()
	{
		if(FILETIMESTAMP(GLOBALPROFILE) > lLastModifiedDate)
		{
			LOAD(GLOBALPROFILE);
		}
	}
	
	private long FILETIMESTAMP(String filename)
	{
		File fFile = new File(filename);
		long lLastModified = fFile.lastModified();
		fFile = null;
		return lLastModified;
	}	
}

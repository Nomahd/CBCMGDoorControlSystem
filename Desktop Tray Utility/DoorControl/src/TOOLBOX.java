import java.io.*;
import java.lang.System;
import java.util.*;
import java.text.*;

class StreamGobbler extends Thread
{
    InputStream is;
    String LOGFILE ;
    
    StreamGobbler(InputStream is, String sLOGFILE)
    {
        this.is = is;
        this.LOGFILE = sLOGFILE ;
    }
    
    public void run()
    {
        try
        {
            InputStreamReader isr = new InputStreamReader(is);
            BufferedReader br = new BufferedReader(isr);
            String line=null;
            while ( (line = br.readLine()) != null)
            	LOGMSG(LOGFILE, line);
        } 
        catch (IOException ioe)
        {
            ioe.printStackTrace();  
        }
    }

	private void LOGMSG(String FileName, String Msg)
	{
		FileWriter      LOG_fileWriter = null;
		BufferedWriter  LOG_bufferedWriter;
		if(FileName != null)
		{
		    try
		    {
    			LOG_fileWriter = new FileWriter(FileName, true);
    			LOG_bufferedWriter = new BufferedWriter(LOG_fileWriter);
    			LOG_bufferedWriter.write(Msg+"\r\n");
    			LOG_bufferedWriter.flush();
    		 	LOG_fileWriter.flush();
    		 	LOG_bufferedWriter.close();
    		 	LOG_fileWriter.close();
    		 	LOG_bufferedWriter = null;
    		 	LOG_fileWriter = null;
		 	}
		 	catch(Exception e)
		 	{}
		}
		return;
	}
}

class TOOLBOX
{
	int iLogLevel ;     // LogLevel [-3, 0..9]
	String sLogPrefix ;
	PROPERTIES props ;
	String gLOGFILE = null;
	
	TOOLBOX()
	{
		iLogLevel = 0 ;
		sLogPrefix = "    " ;
        PROFILE(System.getProperty("PROFILE"));
        gLOGFILE = GETENV("LOGFILE");
	}
	public void PROFILE(String sFileName)
	{
		props = new PROPERTIES(sFileName);
	}
	public void SaveProfile()
	{
		props.SAVE();
	}
	public void SETENV(String key, String value)
	{
	    props.SETENV(key, value);
	}
	public void REFRESH()
	{
		props.REFRESH();
	}
	public void SETLOGLEVEL(String level)
	{
		iLogLevel = Integer.valueOf(level).intValue() ;
	}
	public void SETLOGLEVEL(int level)
	{
		iLogLevel = level ;
	}
	public void SETLOGPREFIX(String prefix)
	{
		sLogPrefix = prefix ;
	}
	
	public String DATETIME()
	{
		String d ;
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		d = df.format(date.getTime());
		date = null;
		df = null;
		return d;
	}

	public String TIME()
	{
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("HH:mm:ss");
		String t = df.format(date.getTime());
		date = null;
		df = null;
		return t;
	}
	public void LOG(String s)
	{
		LOG(0,s);
	}
	public void LOG(int level, String s)
	{
		if(level <= iLogLevel)
		{
			String sLevel ;
			switch(level)
			{
				case -3 : sLevel = "F" ;      break;
				case -2 : sLevel = "E" ;      break;
				case -1 : sLevel = "W" ;      break;
				case  0 : sLevel = "I" ;      break;
				default : sLevel = ""+level ; break;
			}
			String sLOGFILE = GETENV("LOGFILE");
			if(sLOGFILE==null) sLOGFILE = gLOGFILE ;
	        LOGMSG(sLOGFILE, DATETIME()+" "+sLevel+" "+sLogPrefix+" "+s);
		}
	}
	public void DEBUG(int level, String s)
	{
		if(level <= iLogLevel)
		{
			String sLevel ;
			switch(level)
			{
				case -3 : sLevel = "F" ;      break;
				case -2 : sLevel = "E" ;      break;
				case -1 : sLevel = "W" ;      break;
				case  0 : sLevel = "I" ;      break;
				default : sLevel = ""+level ; break;
			}
	        LOGMSG(gLOGFILE, DATETIME()+" "+sLevel+" "+sLogPrefix+" "+s);
		}
	}

	public void LOGMSG(String FileName, String Msg)
	{
		BufferedWriter  LOG_bufferedWriter;
		if(FileName != null)
		{
		    try
		    {
    	        FileOutputStream fos = new FileOutputStream(FileName,true);
            	Writer out = new OutputStreamWriter(fos, "UTF8");
    			LOG_bufferedWriter = new BufferedWriter(out);
    			LOG_bufferedWriter.write(Msg+"\r\n");
    			LOG_bufferedWriter.flush();
    			out.flush();
    		 	LOG_bufferedWriter.close();
    		 	out.close();
    		 	LOG_bufferedWriter = null;
    		 	out = null ;
		 	}
		 	catch(Exception e)
		 	{}
		}
		return;
	}

	public String GETENV(String key)
	{
		String s = System.getProperty(key);
		if(s == null)
		{
			s = props.GETENV(key);
		}
		return s ;
	}
	
    public int GETENVINT(String key)
    {
        return Integer.valueOf(GETENV(key)).intValue();
    }
	
	public String RPAD(String in, int length, char pad)
	{
	    StringBuffer out = new StringBuffer(length);
	    int least = in.length();
	    if(least > length)
			least = length ;
	    out.append(in.substring(0,least));
	    int fill = length - out.length();
	    for(int i=0;i<fill;i++)
	    	out.append(pad);
	    return out.toString();
	}
  
	public String RPAD(String in, int length)
	{
		return RPAD(in,length,' ');
	}
  
	public String LPAD(String in, int length, char pad)
	{
		StringBuffer out = new StringBuffer(length);
		int least = in.length();
		if(least > length)
			least = length ;
		out.append(in.substring(0,least));
		int fill = length - out.length();
		for(int i=0;i<fill;i++)
			out.insert(0,pad);
		return out.toString();
	}
  
	public String LPAD(String in, int length)
	{
		return LPAD(in,length,' ');
	}
  
	public String ZPAD(int in, int length)
	{
		String s = "" + in ;
		return LPAD(s,length,'0');
	}

	public String SYSDATE()
	{
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		String d = df.format(date.getTime());
		date = null;
		df = null;
		return d ;
	}

	public String SYSTIME()
	{
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd-HHmmss-SSS");
		String t = df.format(date.getTime());
		date = null;
		df = null ;
		return t ;
	}
	
	public String SYSTIME(String fmt)
	{
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat(fmt);
		String t = df.format(date.getTime());
		date = null;
		df = null;
		return t;
	}

	public String SYSDATETIME(Date d, String fmt)
	{
		SimpleDateFormat df = new SimpleDateFormat(fmt);
		String t = df.format(d);
		df = null;
		return t;
	}
	public String SYSDATETIME(Date d)
	{
		return SYSDATETIME(d,"yyyyMMdd-HHmmss");
	}
	public String SYSDATETIME()
	{
		Calendar date = Calendar.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd-HHmmss");
		String t = df.format(date.getTime());
		date = null;
		df = null;
		return t;
	}
	
	public void ERRLOG(String s)
	{
		System.err.println(TIME()+" "+s);
		System.exit(1);
	}
	
	public void PRGERROR(String s)
	{
		System.err.println(TIME()+" "+s);
		System.exit(-1);
	}

	public String REPLACE(String origString, String oldString, String newString)
	{
		String s = origString ;
		int i1 = s.indexOf(oldString);
		while(i1 != -1)
		{
			String s1 = s.substring(0,i1);
	    	String s3 = s.substring(i1+oldString.length());
			s = s1 + newString + s3 ;        		
			i1 = s.indexOf(oldString);  		
		}
		return s;
	}

	public String TRIM(String origString)
	{
		return REPLACE(origString," ","");
	}
	
	public void SHELLEXEC(String sCommand, boolean abort, boolean wait)
	{
		String sLOGFILE = GETENV("LOGFILE");
		if(sLOGFILE==null) 
			sLOGFILE = gLOGFILE ;
		LOG(0,sCommand);
		StringTokenizer parser = new StringTokenizer(sCommand," ");
		try
		{
			String[] progarray = new String[parser.countTokens()] ;
			int i = 0 ;
			while(parser.hasMoreTokens())
				progarray[i++] = parser.nextToken();
			try
			{
				
				Process p1 = Runtime.getRuntime().exec(progarray);
				
	            StreamGobbler errorGobbler  = new StreamGobbler(p1.getErrorStream(), sLOGFILE);                        
	            StreamGobbler outputGobbler = new StreamGobbler(p1.getInputStream(), sLOGFILE);	                
	            errorGobbler.start();
	            outputGobbler.start();
	            if(wait) p1.waitFor();
			}
			catch(IOException e)
			{
				LOG(-2,"SYSTEM ERROR: "+e);
				if(abort == true) System.exit(-1);
			}
			catch(Throwable t)
			{
				t.printStackTrace();
			}
		}
		catch(NoSuchElementException e) {}
	}
  
	public boolean RENAME(String fn1, String fn2)
	{
		DEBUG(2,"RENAME "+fn1+" "+fn2);
		if(FILEEXISTS(fn2)) DELETE(fn2);
		File f1 = new File(fn1);
		File f2 = new File(fn2);
		return f1.renameTo(f2);
	}

	public void COPY(String fn1, String fn2)
	{		 
    	InputStream inStream = null;
    	OutputStream outStream = null;
 
    	try
    	{
    	    File afile =new File(fn1);
    	    File bfile =new File(fn2);
 
    	    inStream  = new FileInputStream(afile);
    	    outStream = new FileOutputStream(bfile);
 
    	    byte[] buffer = new byte[1024];
 
    	    int length;
    	    //copy the file content in bytes 
    	    while ((length = inStream.read(buffer)) > 0)
    	    { 
    	    	outStream.write(buffer, 0, length);
    	    }
 
    	    inStream.close();
    	    outStream.close(); 
    	}
    	catch(IOException e)
    	{
    		e.printStackTrace();
    	}    
	}

	public boolean DELETE(String fn)
	{
		DEBUG(2,"DELETE "+fn);
		return (new File(fn)).delete();
	}

	public void SAVEFILE(String filename, String aContents)
	{
		DEBUG(2,"SAVEFILE "+filename);
   		File aFile = new File(filename);
		Writer output = null;
		try 
		{
			output = new BufferedWriter( new FileWriter(aFile) );
			output.write( aContents );
			if (output != null) output.close();
		}
		catch(IOException ex)
		{
			DEBUG(-2,"IOException on SaveFile: " + ex);
			ex.printStackTrace();
		}
	}
	
	public boolean FILEEXISTS(String filename)
	{
		boolean b = false ;
		File f = new File(filename);
		if(f.exists()) b = true ;
		f = null;
    	return b;
	}

	public void fprintf(OutputStream o, String s) throws IOException
	{
		byte buf[] = s.getBytes();
		o.write(buf);	
	}

	public void SLEEP(long ms)
	{
		try
		{
			Thread.sleep(ms);
		}
		catch(InterruptedException e) {}
	}
	
    public String READALL(String filename) 
	{
		LOG(6,"READALL " + filename);
		File aFile = new File(filename);
		int length = (int) aFile.length();
	    StringBuffer sb = new StringBuffer(length);
		BufferedReader input = null;
		try 
		{
			input = new BufferedReader( new FileReader(aFile) );
			String line = null; //not declared within while loop
			while (( line = input.readLine()) != null)
			{
				sb.append(line).append("\r\n");
			}
		}
		catch (FileNotFoundException fex) 
		{
			LOG(-3,"TOOLBOX:READALL:FileNotFoundException:fex: " + filename + " " + fex);
			fex.printStackTrace();
		}
		catch (IOException ioe)
		{
			LOG(-3,"TOOLBOX:READALL:IOException:ioe: " + filename + " "+ioe);
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
    			LOG(-3,"TOOLBOX:READALL:IOException:ioe: close " + filename + " "+ioe);
			    ioe.printStackTrace();
			}
		}
		aFile = null;
		return sb.toString();
	}

    public Calendar S2C(String sDATETIME)
    {
    	String s = sDATETIME;
		Calendar c1 = Calendar.getInstance();
		int yyyy = Integer.valueOf(s.substring( 0, 4)).intValue();
		int mm   = Integer.valueOf(s.substring( 4, 6)).intValue();
		int dd   = Integer.valueOf(s.substring( 6, 8)).intValue();
		int hh   = Integer.valueOf(s.substring( 9,11)).intValue(); 
	    int mi   = Integer.valueOf(s.substring(11,13)).intValue(); 
		int ss   = Integer.valueOf(s.substring(13,15)).intValue();
		c1.set(yyyy, mm-1, dd, hh, mi, ss);
    	return c1 ;
    }

    public Date S2D(String sDATETIME)
    {
		Calendar c1 = S2C(sDATETIME);
    	Date d = c1.getTime();
    	return d ;
    }
    
	public String AddTime(String sDATETIME, long INTERVAL_SECONDS)
	{
	    String s = sDATETIME;
		Calendar c1 = S2C(sDATETIME);
		
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd-HHmmss");
   		c1.add(Calendar.SECOND, (int) INTERVAL_SECONDS);
        s = df.format(c1.getTime());
        
        df = null ;
        c1 = null ;
        DEBUG(8,"AddTime "+s);
        return s ;
	}

}
